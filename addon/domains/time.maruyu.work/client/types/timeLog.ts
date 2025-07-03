import { z } from "zod"
import { TimeQuotaIdSchema, TimeQuotaSchema, TimeQuotaType } from "../../share/types/timeQuota";
import { MdateTz, MdateTzSchema, TimeZone } from "@ymwc/mdate";
import {
  ResponseObjectType as FetchItemResponseObjectType,
} from "../../share/protocol/timeLog/fetchItem";
import {
  ResponseObjectType as CreateItemResponseObjectType,
} from "../../share/protocol/timeLog/createItem";
import {
  ResponseObjectType as UpdateItemResponseObjectType,
} from "../../share/protocol/timeLog/updateItem";
import { TimeLogIdSchema } from "../../share/types/timeLog";
export type { 
  TimeLogIdType,
} from "../../share/types/timeLog";

export const TimeLogSchema = z.object({
  id: TimeLogIdSchema,
  timeQuota: TimeQuotaSchema,
  startMdate: MdateTzSchema,
  endMdate: MdateTzSchema,
  output: z.string(),
  review: z.string(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
})

export type TimeLogType = z.infer<typeof TimeLogSchema>;

export function convertFetchItemResponseToClient(
  responseObject: FetchItemResponseObjectType,
  timeQuotaList: TimeQuotaType[],
  timezone: TimeZone,
):TimeLogType{
  const { id, timeQuotaId, start, end, output, review } = responseObject.timeLog;
  const timeQuota = timeQuotaList.find(q=>q.id == timeQuotaId);
  if(timeQuota == undefined) throw new Error("TimeQuota is not found.");
  return {
    id,
    timeQuota,
    startMdate: new MdateTz(start, timezone),
    endMdate: new MdateTz(end, timezone), 
    output, 
    review,
  }
}

export function convertCreateItemResponseToClient(
  responseObject:CreateItemResponseObjectType,
  timeQuotaList: TimeQuotaType[],
  timezone: TimeZone,
):TimeLogType{
  const { id, timeQuotaId, start, end, output, review } = responseObject.timeLog;
  const timeQuota = timeQuotaList.find(q=>q.id == timeQuotaId);
  if(timeQuota == undefined) throw new Error("TimeQuota is not found.");
  return {
    id,
    timeQuota,
    startMdate: new MdateTz(start, timezone),
    endMdate: new MdateTz(end, timezone),
    output, 
    review,
  }
}

export function convertUpdateItemResponseToClient(
  responseObject:UpdateItemResponseObjectType,
  timeQuotaList: TimeQuotaType[],
  timezone: TimeZone,
):TimeLogType{
  const { id, timeQuotaId, start, end, output, review } = responseObject.timeLog;
  const timeQuota = timeQuotaList.find(q=>q.id == timeQuotaId);
  if(timeQuota == undefined) throw new Error("TimeQuota is not found.");
  return {
    id,
    timeQuota,
    startMdate: new MdateTz(start, timezone),
    endMdate: new MdateTz(end, timezone),
    output, 
    review,
  }
}