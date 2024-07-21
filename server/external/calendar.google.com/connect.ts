import { google } from 'googleapis';
import { deleteData, getData, postData, updateData } from 'maruyu-webcommons/node/aggregator';
import mconfig from "maruyu-webcommons/node/mconfig";

async function getOAuth2Client(){
  const credentials = await getData("calendar","googlecalendar_credentials",mconfig.get("providerUserId")).then((res:any)=>res.credentials)
  if(credentials == null) return null;
  const { client_id, client_secret, redirect_uri } = credentials;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
  return oAuth2Client;
}

export async function getToken(userName:string){
  const token = await getData("calendar","googlecalendar_tokens",userName)?.then((res:any)=>res.token)
  return token
}

export async function getCalendar(userName:string){
  const oAuth2Client = await getOAuth2Client();
  if(oAuth2Client == null) return null
  const token = await getToken(userName);
  if(!token) { console.error(`register google calendar connection for ${userName}`); return null }
  oAuth2Client.setCredentials(token)
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  return calendar;
}

export async function registerGrant(client_id, client_secret, redirect_uri){
  await updateData("calendar","googlecalendar_credentials",mconfig.get("providerUserId"),[],{
    client_id, client_secret, redirect_uri
  })
}

export async function getGrantUrl(){
  const oAuth2Client = await getOAuth2Client()
  if(oAuth2Client == null) return null;
  const grant_url = await oAuth2Client.generateAuthUrl({ 
    access_type: 'offline', 
    scope: ['https://www.googleapis.com/auth/calendar'], 
    include_granted_scopes: true,
    response_type: "code"
  });
  return grant_url
}

export async function disconnect(user_id){
  const oAuth2Client = await getOAuth2Client()
  if(oAuth2Client == null) return null;
  return await oAuth2Client.revokeCredentials().then(async res=>{
    await deleteData("calendar","googlecalendar_tokens",user_id)
  })
}

export async function processRedirect(user_id, code){
  const oAuth2Client = await getOAuth2Client()
  if(oAuth2Client == null) return null;
  const token = await oAuth2Client.getToken(code).then(res=>res.tokens)
  oAuth2Client.setCredentials(token);

  return await updateData("calendar","googlecalendar_tokens",user_id,[],{token})
}