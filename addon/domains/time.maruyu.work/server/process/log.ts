import { UserIdType } from '@server/types/user';
import * as timeSdk from '@maruyu/time-sdk';
import { getStoredApiKey } from './connect';
import { DOMAIN } from "../../const";

// Initialize SDK once
timeSdk.initSDK({
  baseURL: `https://${DOMAIN}`
});

export async function fetchLogList(props:{
  userId: UserIdType,
  startTime: Date,
  endTime: Date,
}):Promise<timeSdk.LogFullType[]>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const result = await timeSdk.fetchLogListFull(apiKey, queryData);
  return result.logList;
}

export async function fetchLog(props:{
  userId: UserIdType,
  id: timeSdk.LogIdType,
}):Promise<timeSdk.LogType>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const result = await timeSdk.fetchLog(apiKey, queryData);
  return result.log;
}

export async function fetchLogFull(props:{
  userId: UserIdType,
  id: timeSdk.LogIdType,
}):Promise<timeSdk.LogFullType>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const result = await timeSdk.fetchLogFull(apiKey, queryData);
  return result.log;
}

export async function createLog(props:{
  userId: UserIdType,
  quotaId: timeSdk.QuotaIdType,
  startTime: Date,
  endTime: Date,
  output: string,
  review: string,
}):Promise<timeSdk.LogType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const result = await timeSdk.createLog(apiKey, bodyData);
  return result.log;
}

export async function updateLog(props:{
  userId: UserIdType,
  id: timeSdk.LogIdType,
  quotaId?: timeSdk.QuotaIdType,
  startTime?: Date,
  endTime?: Date,
  output?: string,
  review?: string,
}):Promise<timeSdk.LogType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const result = await timeSdk.updateLog(apiKey, bodyData);
  return result.log;
}

export async function deleteLog(props:{
  userId: UserIdType,
  id: timeSdk.LogIdType,
}):Promise<void>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  await timeSdk.deleteLog(apiKey, bodyData);
}