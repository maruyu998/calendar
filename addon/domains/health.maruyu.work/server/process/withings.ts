import { getPacket } from "maruyu-webcommons/commons/utils/fetch";
import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { DOMAIN } from "../../const";
import { RawWithingsNightEventType } from "../types/withingsSleepLog";
import { getStoredApiKey } from "./connect";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

export async function fetchNighteventList({
  userId,
  startTime,
  endTime,
}:{
  userId: UserIdType,
  startTime: Date,
  endTime: Date,
}):Promise<RawWithingsNightEventType[]>{
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/v1/calendar/withings/nightevent/list`);
  const queryData = { startTime, endTime };
  return await getPacket({ url, queryData, option: { accessToken: apiKey } })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("nightEventList" in (data as object))) throw new Error("nightEventList is not found");
                const nightEventList = (data as { nightEventList: RawWithingsNightEventType[] }).nightEventList;
                return nightEventList;
              }).catch(e=>{
                console.error("fetchEvent<in Health>", e);
                return new Array<RawWithingsNightEventType>();
              })
}