import { UserIdType } from '@server/types/user';
import { getPacket, postPacket, putPacket, deletePacket } from '@ymwc/http';
import { DOMAIN } from "../../const";
import { LogApiType } from "../types/log";
import { LogIdType } from '../../share/types/log';
import { QuotaIdType } from '../../share/types/quota';
import { getStoredApiKey } from './connect';

export async function fetchLogList(props:{
  userId: UserIdType,
  startTime: Date,
  endTime: Date,
}):Promise<LogApiType[]>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/log/list`);
  const option = { accessToken: apiKey };
  return await getPacket({ url, queryData, option })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("timeLogList" in (data as object))) throw new Error("timeLogList is not found");
                const timeLogList = (data as { timeLogList: LogApiType[] }).timeLogList;
                return timeLogList;
              }).catch(e=>{
                console.error("fetchEvent<in Time>", e);
                return new Array<LogApiType>();
              })
}

export async function fetchLog(props:{
  userId: UserIdType,
  id: LogIdType,
}):Promise<LogApiType>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/log/item`);
  const option = { accessToken: apiKey };
  return await getPacket({ url, queryData, option })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("log" in (data as object))) throw new Error("timeLog is not found");
                const timeLog = (data as { log: LogApiType }).log;
                return timeLog;
              })
}

export async function createLog(props:{
  userId: UserIdType,
  quotaId: QuotaIdType,
  startTime: Date,
  endTime: Date,
  output: string,
  review: string,
}):Promise<LogApiType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/log/item`);
  const option = { accessToken: apiKey };
  return await postPacket({ url, bodyData, option })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("log" in (data as object))) throw new Error("timeLog is not found");
                const timeLog = (data as { log: LogApiType }).log;
                return timeLog;
              })
}

export async function updateLog(props:{
  userId: UserIdType,
  id: LogIdType,
  startTime?: Date,
  endTime?: Date,
  output?: string,
  review?: string,
}):Promise<LogApiType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/log/item`);
  const option = { accessToken: apiKey };
  return await putPacket({ url, bodyData, option })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("log" in (data as object))) throw new Error("timeLog is not found");
                const timeLog = (data as { log: LogApiType }).log;
                return timeLog;
              })
}

export async function deleteLog(props:{
  userId: UserIdType,
  id: LogIdType,
}):Promise<LogApiType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/log/item`);
  const option = { accessToken: apiKey };
  return await deletePacket({ url, bodyData, option })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("log" in (data as object))) throw new Error("timeLog is not found");
                const timeLog = (data as { log: LogApiType }).log;
                return timeLog;
              })
}