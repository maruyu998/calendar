import { z } from "zod"
import { QuotaSchema } from "../../share/types/quota";
import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { ResponseObjectType as FetchItemResponseObjectType } from "../../share/protocol/log/fetchItem";
import { ResponseObjectType as CreateItemResponseObjectType } from "../../share/protocol/log/createItem";
import { ResponseObjectType as UpdateItemResponseObjectType } from "../../share/protocol/log/updateItem";
import { ResponseObjectType as DeleteItemResponseObjectType } from "../../share/protocol/log/deleteItem";
import { LogIdSchema } from "../../share/types/log";

const MdateSchema = z.custom<Mdate>((val) => val instanceof Mdate);

export const LogSchema = z.object({
  id: LogIdSchema,
  quota: QuotaSchema,
  startMdate: MdateSchema,
  endMdate: MdateSchema,
  output: z.string(),
  review: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type LogType = z.infer<typeof LogSchema>;


export const LogApiSchema = z.object({
  id: LogIdSchema,
  quota: QuotaSchema,
  startTime: z.date(),
  endTime: z.date(),
  output: z.string(),
  review: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type LogApiType = z.infer<typeof LogApiSchema>;

export function convertRawToFetchItemResponseObject(
  raw: LogApiType,
):FetchItemResponseObjectType{
  const { id, startTime, endTime, quota, output, review } = raw;
  return {
    log: {
      id,
      quotaId: quota.id,
      startTime,
      endTime,
      output,
      review,
    }
  }
}

export function convertRawToCreateItemResponseObject(
  raw: LogApiType
):CreateItemResponseObjectType{
  const { id, startTime, endTime, quota, output, review } = raw;
  return {
    log: {
      id,
      quotaId: quota.id,
      startTime,
      endTime,
      output,
      review,
    }
  }
}

export function convertRawToUpdateItemResponseObject(
  raw: LogApiType
):UpdateItemResponseObjectType{
  const { id, startTime, endTime, quota, output, review } = raw;
  return {
    log: {
      id,
      quotaId: quota.id,
      startTime,
      endTime,
      output,
      review,
    }
  }
}

export function convertRawToDeleteItemResponseObject(
  raw: LogApiType
):DeleteItemResponseObjectType{
  const { id } = raw;
  return {
    log: { id }
  }
}