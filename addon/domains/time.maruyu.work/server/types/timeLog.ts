import { z } from "zod"
import { TimeQuotaSchema } from "../../share/types/timeQuota";
import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { ResponseObjectType as FetchItemResponseObjectType } from "../../share/protocol/timeLog/fetchItem";
import { ResponseObjectType as CreateItemResponseObjectType } from "../../share/protocol/timeLog/createItem";
import { ResponseObjectType as UpdateItemResponseObjectType } from "../../share/protocol/timeLog/updateItem";
import { ResponseObjectType as DeleteItemResponseObjectType } from "../../share/protocol/timeLog/deleteItem";
import { TimeLogIdSchema } from "../../share/types/timeLog";

const MdateSchema = z.custom<Mdate>((val) => val instanceof Mdate);

export const TimeLogSchema = z.object({
  id: TimeLogIdSchema,
  timeQuota: TimeQuotaSchema,
  startMdate: MdateSchema,
  endMdate: MdateSchema,
  output: z.string(),
  review: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type TimeLogType = z.infer<typeof TimeLogSchema>;


export const TimeLogApiSchema = z.object({
  id: TimeLogIdSchema,
  timeQuota: TimeQuotaSchema,
  startTime: z.date(),
  endTime: z.date(),
  output: z.string(),
  review: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type TimeLogApiType = z.infer<typeof TimeLogApiSchema>;

export function convertRawToFetchItemResponseObject(
  raw: TimeLogApiType,
):FetchItemResponseObjectType{
  const { id, startTime, endTime, timeQuota, output, review } = raw;
  return {
    timeLog: {
      id,
      timeQuotaId: timeQuota.id,
      start: startTime.getTime(),
      end: endTime.getTime(),
      output,
      review,
    }
  }
}

export function convertRawToCreateItemResponseObject(
  raw: TimeLogApiType
):CreateItemResponseObjectType{
  const { id, startTime, endTime, timeQuota, output, review } = raw;
  return {
    timeLog: {
      id,
      timeQuotaId: timeQuota.id,
      start: startTime.getTime(),
      end: endTime.getTime(),
      output,
      review,
    }
  }
}

export function convertRawToUpdateItemResponseObject(
  raw: TimeLogApiType
):UpdateItemResponseObjectType{
  const { id, startTime, endTime, timeQuota, output, review } = raw;
  return {
    timeLog: {
      id,
      timeQuotaId: timeQuota.id,
      start: startTime.getTime(),
      end: endTime.getTime(),
      output,
      review,
    }
  }
}

export function convertRawToDeleteItemResponseObject(
  raw: TimeLogApiType
):DeleteItemResponseObjectType{
  const { id } = raw;
  return {
    timeLog: { id }
  }
}