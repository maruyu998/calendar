import { z } from "zod";
import { ResponseObjectType as FetchItemResponseObjectType } from "../../share/protocol/fitbitSleepLog/fetchItem";
import { MdateTz, MdateTzSchema, TimeZone } from "@ymwc/mdate";
import { FitbitIdSchema, FitbitSleepLogIdSchema } from "../../share/types/fitbitSleepLog";

export const FitbitSleepLogSchema = z.object({
  id: FitbitSleepLogIdSchema,
  title: z.string(),
  description: z.string(),
  startMdate: MdateTzSchema,
  endMdate: MdateTzSchema,
  updatedAt: z.date(),
  fitbitId: FitbitIdSchema,
  fitbitInnerIndex: z.number(),
});

export type FitbitSleepLogType = z.infer<typeof FitbitSleepLogSchema>;

export function convertFetchItemResponseToClient(
  responseObject: FetchItemResponseObjectType,
  timezone: TimeZone,
):FitbitSleepLogType{
  const { id, title, description, startTime, endTime, updatedAt, fitbitId, fitbitInnerIndex } = responseObject.fitbitSleepLog;
  return {
    id, title, description,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
    updatedAt, fitbitId, fitbitInnerIndex
  }
}