import { getPacket } from "maruyu-webcommons/commons/utils/fetch"
import { RawAndroidAppUsageType } from "../types/androidAppUsage";
import { DOMAIN } from "../../const";
import { getStoredApiKey } from "./connect";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

export async function fetchAndroidAppUsageList(props:{
  userId: UserIdType,
  startTime: Date,
  endTime: Date,
}):Promise<RawAndroidAppUsageType[]>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/v1/calendar/android/appUsage/list`);
  return await getPacket({ url, queryData, option: { accessToken: apiKey } })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("appUsageList" in (data as object))) throw new Error("appUsageList is not found");
                const appUsageList = (data as { appUsageList: RawAndroidAppUsageType[] }).appUsageList;
                return appUsageList;
              })
              .catch(e=>{
                console.error("fetchEvent<in Datafoot>", e);
                return new Array<RawAndroidAppUsageType>();
              })
}

export async function fetchAndroidAppUsage(props:{
  userId: UserIdType,
  id: string,
}):Promise<RawAndroidAppUsageType>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/v1/calendar/android/appUsage/item`);
  return await getPacket({ url, queryData, option: { accessToken: apiKey } })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("appUsage" in (data as object))) throw new Error("appUsage is not found");
                const appUsage = (data as { appUsage: RawAndroidAppUsageType }).appUsage;
                return appUsage;
              })
}