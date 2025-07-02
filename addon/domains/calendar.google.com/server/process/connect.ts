import { google } from 'googleapis';
import CertificationModel, { CredentialType, TokenType } from '@server/mongoose/CertificationModel';
import { AuthenticationError, InternalServerError } from '@ymwc/errors';
import { UserIdType } from 'maruyu-webcommons/commons/types/user';


////////////////////////////////////////////////////////////////////////////////////////////////
// Get and store DB credentials and revoke

export async function storeCredential({
  userId,
  clientId,
  clientSecret,
  redirectUri
}:{
  userId: UserIdType,
  clientId: string,
  clientSecret: string,
  redirectUri: string
}){
  const certification = await CertificationModel.findOneAndUpdate(
    { userId, service: "calendar.google.com", resourceKey: "credential" },
    { data: { clientId, clientSecret, redirectUri }},
    { upsert: true, new: true }
  ).catch(error=>{
    console.error(error);
    throw new InternalServerError("error while updating calendar.google.com credential. A");
  });
  if(!certification) throw new InternalServerError("error while updating calendar.google.com credential. B");
}

export async function getStoredCredential({
  userId
}:{
  userId: UserIdType
}):Promise<null|{
  clientId: string,
  clientSecret: string,
  redirectUri: string
}>{
  const certification = await CertificationModel.findOne({userId, service:"calendar.google.com", resourceKey:"credential"});
  if(!certification) return null;
  const { data } = certification;
  if(!(data as any).clientId) throw new InternalServerError("clientId is not registered.");
  if(!(data as any).clientSecret) throw new InternalServerError("clientSecret is not registered.");
  if(!(data as any).redirectUri) throw new InternalServerError("redirectUri is not registered.");
  const { clientId, clientSecret, redirectUri } = data as CredentialType;
  return { clientId, clientSecret, redirectUri };
}

export async function storeToken({
  userId,
  accessToken,
  refreshToken,
  expiresAt,
  scope,
  tokenType
}:{
  userId: UserIdType,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  scope: string,
  tokenType: string
}){
  const certification = await CertificationModel.findOneAndUpdate(
    { userId, service: "calendar.google.com", resourceKey: "token" },
    { data: { accessToken, refreshToken, expiresAt, scope, tokenType }},
    { upsert: true, new: true }
  ).catch(error=>{
    console.error(error);
    throw new InternalServerError("error while updating calendar.google.com token. A");
  });
  if(!certification) throw new InternalServerError("error while updating calendar.google.com token. B");
}

export async function getStoredToken({
  userId
}:{
  userId: UserIdType
}):Promise<TokenType>{
  const certification = await CertificationModel.findOne({userId, service:"calendar.google.com", resourceKey:"token"}).lean();
  if(!certification) throw new AuthenticationError("token certification is not found.");
  const { data } = certification;
  if(!(data as any).tokenType) throw new InternalServerError("tokenType is not included in token certification data.");
  if(!(data as any).accessToken) throw new InternalServerError("accessToken is not included in token certification data.");
  if(!(data as any).refreshToken) throw new InternalServerError("refreshToken is not included in token certification data.");
  if(!(data as any).expiresAt) throw new InternalServerError("expiresAt is not included in token certification data.");
  if(!(data as any).scope) throw new InternalServerError("scope is not included in token certification data.");
  const token = data as TokenType;
  return token;
}

export async function revokeToken({
  userId
}:{
  userId: UserIdType
}){
  const oAuth2Client = await getOAuth2Client({userId})
  await oAuth2Client.revokeCredentials();

  const deleteResult = await CertificationModel.deleteMany({
    userId, service: "calendar.google.com", resourceKey: "token"
  }).catch(error=>{
    console.error(error);
    throw new InternalServerError("error while deleting calendar.google.com token. A");
  });
  if(deleteResult.deletedCount == 0) throw new InternalServerError("error while deleting calendar.google.com token. B");
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Common utils

async function getOAuth2Client({
  userId
}:{
  userId: UserIdType
}){
  const credential = await getStoredCredential({userId});
  if(credential == null) throw new AuthenticationError("Your calendar.google.com credential is not found.");
  const { clientId, clientSecret, redirectUri } = credential;
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  return oAuth2Client;
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Initial

export async function generateConnectUrl({
  userId
}:{
  userId: UserIdType
}):Promise<string>{
  const oAuth2Client = await getOAuth2Client({userId});
  const grantUrl = await oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    include_granted_scopes: true,
    response_type: "code"
  });
  return grantUrl;
}

export async function getAndStoreTokenByCode({
  userId,
  code
}:{
  userId: UserIdType,
  code: string
}){
  const oAuth2Client = await getOAuth2Client({userId})
  const token = await oAuth2Client.getToken(code).then(res=>res.tokens).catch(error=>{console.error(error); throw error;});
  const {
    "access_token": accessToken,
    "refresh_token": refreshToken,
    "scope": scope,
    "token_type": tokenType,
    "expiry_date": expiresAt
  } = token;
  if(!accessToken) throw new InternalServerError("accessToken is not included in fetched token certification data from google.");
  if(!refreshToken) throw new InternalServerError("refreshToken is not included in fetched token certification data from google.");
  if(!scope) throw new InternalServerError("scope is not included in fetched token certification data from google.");
  if(!tokenType) throw new InternalServerError("tokenType is not included in fetched token certification data from google.");
  if(!expiresAt) throw new InternalServerError("expiresAt is not included in fetched token certification data from google.");

  oAuth2Client.setCredentials({
    "access_token": accessToken,
    "refresh_token": refreshToken,
    "scope": scope,
    "token_type": tokenType,
    "expiry_date": expiresAt
  });
  await storeToken({userId, accessToken, refreshToken, scope, tokenType, expiresAt})
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Other
export async function getCalendar({
  userId
}:{
  userId: UserIdType
}){
  const oAuth2Client = await getOAuth2Client({userId});
  const token = await getStoredToken({userId});
  if(!token) throw new AuthenticationError(`register google calendar connection`);
  const { accessToken, refreshToken, scope, tokenType, expiresAt } = token;
  oAuth2Client.setCredentials({
    "access_token": accessToken,
    "refresh_token": refreshToken,
  });
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  return calendar;
}