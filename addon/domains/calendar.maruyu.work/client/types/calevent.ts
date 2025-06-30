import { z } from "zod";
import { ResponseObjectType as FetchItemResponseObjectType } from "../../share/protocol/calevent/fetchItem";
import { MdateTz, MdateTzSchema, TimeZone } from "maruyu-webcommons/commons/utils/mdate";

export const FitbitSleepLogSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  startMdate: MdateTzSchema,
  endMdate: MdateTzSchema,
  updatedAt: z.date(),
});

export type FitbitSleepLogType = z.infer<typeof FitbitSleepLogSchema>;

export function convertFetchItemResponseToClient(
  responseObject: FetchItemResponseObjectType,
  timezone: TimeZone,
):FitbitSleepLogType{
  const { id, title, description, startTime, endTime, updatedAt } = responseObject.calevent;
  return {
    id, title, description,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
    updatedAt
  }
}