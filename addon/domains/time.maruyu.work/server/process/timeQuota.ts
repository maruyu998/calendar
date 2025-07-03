import { getPacket } from '@ymwc/http';
import { DOMAIN } from "../../const";
import { TimeQuotaType } from "../../share/types/timeQuota";
import { getStoredApiKey } from './connect';
import { UserIdType } from 'maruyu-webcommons/commons/types/user';

export async function fetchTimeQuotaList({
  userId,
}:{
  userId: UserIdType,
}):Promise<TimeQuotaType[]>{
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/timeQuota/list`);
  url.searchParams.append("populateTimeQuota", String(true));
  url.searchParams.append("populateTimePurpose", String(true));
  return await getPacket(url.toString(), { accessToken:apiKey })
              .then(({title, message, data})=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("timeQuotaList" in (data as object))) throw new Error("timeQuotaList is not found");
                const timeQuotaList = (data as { timeQuotaList: TimeQuotaType[] }).timeQuotaList;
                return timeQuotaList;
              })
              .catch(e=>{
                console.error("fetchEvent<in Time>", e);
                return new Array<TimeQuotaType>();
              })
}