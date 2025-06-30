import CertificationModel, { ApiKeyType } from '@server/mongoose/CertificationModel';
import { UserIdType } from 'maruyu-webcommons/commons/types/user';
import { AuthenticationError, InternalServerError } from 'maruyu-webcommons/node/errors';


export async function storeApiKey({
  userId,
  apiKey,
}:{
  userId: UserIdType,
  apiKey: string,
}){
  const certification = await CertificationModel.findOneAndUpdate(
    { userId, service: "progress.maruyu.work", resourceKey: "apiKey" },
    { data: { tokenType: "Bearer", apiKey, scope:"" }},
    { upsert: true, new: true }
  ).catch(error=>{
    console.error(error);
    throw new InternalServerError("error while updating progress.maruyu.work apiKey. A");
  });
  if(!certification) throw new InternalServerError("error while updating progress.maruyu.work apiKey. B");
}


export async function getStoredApiKey({
  userId
}:{
  userId: UserIdType
}):Promise<ApiKeyType>{
  const certification = await CertificationModel.findOne({userId, service:"progress.maruyu.work", resourceKey:"apiKey"}).lean();
  if(!certification) throw new AuthenticationError("apiKey certification is not found.");
  const { data } = certification;
  if(!(data as any).tokenType === undefined) throw new InternalServerError("tokenType is not included in apiKey certification data.");
  if(!(data as any).apiKey === undefined) throw new InternalServerError("apiKey is not included in apiKey certification data.");
  if(!(data as any).scope === undefined) throw new InternalServerError("scope is not included in apiKey certification data.");
  return data as ApiKeyType;
}