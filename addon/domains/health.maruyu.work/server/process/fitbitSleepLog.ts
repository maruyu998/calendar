import { getPacket } from "maruyu-webcommons/commons/utils/fetch"
import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { DOMAIN } from "../../const";
import { RawFitbitNightEventType } from "../types/fitbitSleepLog";
import { FitbitSleepLogIdType } from "../../share/types/fitbitSleepLog";
import { InternalServerError } from "@ymwc/errors";
import { getStoredApiKey } from "./connect";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

export async function fetchNighteventList({
  userId,
  startTime,
  endTime
}:{
  userId: UserIdType,
  startTime: Date,
  endTime: Date
}):Promise<RawFitbitNightEventType[]>{
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/v1/calendar/fitbit/nightevent/list`);
  const queryData = { startTime, endTime };
  return await getPacket({ url, queryData, option: { accessToken: apiKey } })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("nightEventList" in (data as object))) throw new Error("nightEventList is not found");
                const nightEventList = (data as { nightEventList: RawFitbitNightEventType[] }).nightEventList;
                return nightEventList;
              }).catch(e=>{
                console.error("fetchEvent<in Health>", e);
                return new Array<RawFitbitNightEventType>();
              })
}

export async function fetchNightEventItem({
  userId,
  id
}:{
  userId: UserIdType,
  id: FitbitSleepLogIdType,
}):Promise<RawFitbitNightEventType>{
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/v1/calendar/fitbit/nightevent/item`);
  return await getPacket({
    url,
    queryData: { id },
    option: { accessToken: apiKey }
  }).then((data)=>{
    if (typeof data != "object") throw new Error("data is not object");
    if (!("nightEvent" in (data as object))) throw new Error("nightEvent is not found");
    const nightEvent = (data as { nightEvent: RawFitbitNightEventType }).nightEvent;
    return nightEvent;
  }).catch(error=>{
    console.error(error);
    throw new InternalServerError("Fetch Fitbit API Failed");
  })
}