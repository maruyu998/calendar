import { z } from "zod"
import { QuotaIdSchema, QuotaSchema, QuotaType } from "../../share/types/quota";
import { MdateTz, MdateTzSchema, TimeZone } from "maruyu-webcommons/commons/utils/mdate";
import {
  ResponseObjectType as FetchItemResponseObjectType,
} from "../../share/protocol/log/fetchItem";
import {
  ResponseObjectType as CreateItemResponseObjectType,
} from "../../share/protocol/log/createItem";
import {
  ResponseObjectType as UpdateItemResponseObjectType,
} from "../../share/protocol/log/updateItem";
import { LogIdSchema } from "../../share/types/log";

export const LogSchema = z.object({
  id: LogIdSchema,
  quota: QuotaSchema,
  startMdate: MdateTzSchema,
  endMdate: MdateTzSchema,
  output: z.string(),
  review: z.string(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
})

export type LogType = z.infer<typeof LogSchema>;

export function convertFetchItemResponseToClient(
  responseObject: FetchItemResponseObjectType,
  quotaList: QuotaType[],
  timezone: TimeZone,
):LogType{
  const { id, quotaId, startTime, endTime, output, review } = responseObject.log;
  const quota = quotaList.find(q=>q.id == quotaId);
  if(quota == undefined) throw new Error("Quota is not found.");
  return {
    id,
    quota,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone), 
    output, 
    review,
  }
}

export function convertCreateItemResponseToClient(
  responseObject:CreateItemResponseObjectType,
  quotaList: QuotaType[],
  timezone: TimeZone,
):LogType{
  const { id, quotaId, startTime, endTime, output, review } = responseObject.log;
  const quota = quotaList.find(q=>q.id == quotaId);
  if(quota == undefined) throw new Error("Quota is not found.");
  return {
    id,
    quota,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
    output, 
    review,
  }
}

export function convertUpdateItemResponseToClient(
  responseObject:UpdateItemResponseObjectType,
  quotaList: QuotaType[],
  timezone: TimeZone,
):LogType{
  const { id, quotaId, startTime, endTime, output, review } = responseObject.log;
  const quota = quotaList.find(q=>q.id == quotaId);
  if(quota == undefined) throw new Error("Quota is not found.");
  return {
    id,
    quota,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
    output, 
    review,
  }
}