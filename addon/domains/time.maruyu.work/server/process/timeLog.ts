import { Mdate } from '@ymwc/mdate';
import { getPacket, postPacket, putPacket, deletePacket } from '@ymwc/http';
import { DOMAIN } from "../../const";
import { TimeLogApiType } from "../types/timeLog";
import { TimeLogIdType } from '../../share/types/timeLog';
import { TimeQuotaIdType } from '../../share/types/timeQuota';
import { getStoredApiKey } from './connect';
import { UserIdType } from '@server/types/user';

export async function fetchTimeLogList({
  userId,
  startMdate,
  endMdate
}:{
  userId: UserIdType,
  startMdate: Mdate,
  endMdate: Mdate,
}):Promise<TimeLogApiType[]>{
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/timeLog/list`);
  url.searchParams.append("startUnix", String(startMdate.unix));
  url.searchParams.append("endUnix", String(endMdate.unix));
  url.searchParams.append("populateTimeQuota", String(true));
  url.searchParams.append("populateTimePurpose", String(true));
  return await getPacket(url.toString(), { accessToken:apiKey }).then(({title, message, data})=>{
    if (typeof data != "object") throw new Error("data is not object");
    if (!("timeLogList" in (data as object))) throw new Error("timeLogList is not found");
    const timeLogList = (data as { timeLogList: TimeLogApiType[] }).timeLogList;
    return timeLogList;
  }).catch(e=>{
    console.error("fetchEvent<in Time>", e);
    return new Array<TimeLogApiType>();
  })
}

export async function fetchTimeLog({
  userId,
  id,
}:{
  userId: UserIdType,
  id: TimeLogIdType,
}):Promise<TimeLogApiType>{
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/timeLog/item`);
  url.searchParams.append("timeLogId", id);
  url.searchParams.append("populateTimeQuota", String(true));
  url.searchParams.append("populateTimePurpose", String(true));
  return await getPacket(url.toString(), { accessToken:apiKey }).then(({title, message, data})=>{
    if (typeof data != "object") throw new Error("data is not object");
    if (!("timeLog" in (data as object))) throw new Error("timeLog is not found");
    const timeLog = (data as { timeLog: TimeLogApiType }).timeLog;
    return timeLog;
  })
}

export async function createTimeLog({
  userId,
  timeQuotaId,
  startMdate,
  endMdate,
  output,
  review,
}:{
  userId: UserIdType,
  timeQuotaId: TimeQuotaIdType,
  startMdate: Mdate,
  endMdate: Mdate,
  output: string,
  review: string,
}):Promise<TimeLogApiType>{
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/timeLog/item`);
  return await postPacket(url.toString(), {
    timeQuotaId,
    startTime: startMdate.toDate(),
    endTime: endMdate.toDate(),
    output, 
    review,
  }, { accessToken:apiKey })
  .then(({title, message, data})=>{
    if (typeof data != "object") throw new Error("data is not object");
    if (!("timeLog" in (data as object))) throw new Error("timeLog is not found");
    const timeLog = (data as { timeLog: TimeLogApiType }).timeLog;
    return timeLog;
  })
}

export async function updateTimeLog({
  userId,
  id,
  startMdate,
  endMdate,
  output,
  review,
}:{
  userId: UserIdType,
  id: TimeLogIdType,
  startMdate?: Mdate,
  endMdate?: Mdate,
  output?: string,
  review?: string,
}):Promise<TimeLogApiType>{
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/timeLog/item`);
  const updateData: Partial<TimeLogApiType> = {}
  if(startMdate){ updateData.startTime = startMdate.toDate() }
  if(endMdate){ updateData.endTime = endMdate.toDate() }
  if(output){ updateData.output = output; }
  if(review){ updateData.review = review; }
  return await putPacket(url.toString(), {
    timeLogId: id, ...updateData
  }, { accessToken:apiKey })
  .then(({title, message, data})=>{
    if (typeof data != "object") throw new Error("data is not object");
    if (!("timeLog" in (data as object))) throw new Error("timeLog is not found");
    const timeLog = (data as { timeLog: TimeLogApiType }).timeLog;
    return timeLog;
  })
}

export async function deleteTimeLog({
  userId,
  id
}:{
  userId: UserIdType,
  id: TimeLogIdType,
}):Promise<TimeLogApiType>{
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/timeLog/item`);
  return await deletePacket(url.toString(), { timeLogId: id }, { accessToken:apiKey })
  .then(({title, message, data})=>{
    if (typeof data != "object") throw new Error("data is not object");
    if (!("timeLog" in (data as object))) throw new Error("timeLog is not found");
    const timeLog = (data as { timeLog: TimeLogApiType }).timeLog;
    return timeLog;
  })
}