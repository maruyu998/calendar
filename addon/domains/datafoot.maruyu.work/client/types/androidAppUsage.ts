import { z } from "zod";
import { ResponseObjectType as FetchItemResponseObjectType } from "../../share/protocol/androidAppUsage/fetchItem";
import { MdateTz, MdateTzSchema, TimeZone } from "@ymwc/mdate";

export const AndroidAppUsageSchema = z.object({
  id: z.string(),
  appId: z.string(),
  appName: z.string(),
  startMdate: MdateTzSchema,
  endMdate: MdateTzSchema,
  updatedAt: z.date(),
});

export type AndroidAppUsageType = z.infer<typeof AndroidAppUsageSchema>;


export function convertFetchItemResponseToClient(
  responseObject: FetchItemResponseObjectType,
  timezone: TimeZone
):AndroidAppUsageType{
  const { id, appId, appName, startTime, endTime, updatedAt } = responseObject.appUsage;
  return {
    id, appId, appName,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
    updatedAt,
  }
}