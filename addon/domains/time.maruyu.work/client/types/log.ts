import { z } from "zod"
import { QuotaFullType } from "@maruyu/time-sdk";
import { MdateTz, MdateTzSchema, TimeZone } from "@ymwc/mdate";
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
import { QuotaFullSchema } from "./quota";
import * as timeSdk from "@maruyu/time-sdk";

// Client-side log schema with MdateTz for time fields
export const LogSchema = z.object({
  id: LogIdSchema,
  quota: QuotaFullSchema,
  startMdate: MdateTzSchema,
  endMdate: MdateTzSchema,
  output: z.string(),
  review: z.string(),
})

export type LogType = z.infer<typeof LogSchema>;

function convertLogToClient(
  log: timeSdk.LogType,
  quotaList: QuotaFullType[],
  timezone: TimeZone,
): LogType {
  const { quotaId, startTime, endTime, ...logRest } = log;
  
  // Use provided quota or find by quotaId
  const quota = quotaList.find(q => q.id === quotaId);
  if (!quota) throw new Error("Quota is not found.");
  
  return {
    ...logRest,
    quota,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
  };
}


function convertLogFullToClient(
  log: timeSdk.LogFullType,
  timezone: TimeZone,
): LogType {
  const { startTime, endTime, ...logRest } = log;  
  return {
    ...logRest,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
  };
}

export function convertFetchItemResponseToClient(
  responseObject: FetchItemResponseObjectType,
  timezone: TimeZone,
): LogType {
  return convertLogFullToClient(responseObject.log, timezone);
}

export function convertCreateItemResponseToClient(
  responseObject: CreateItemResponseObjectType,
  quotaList: QuotaFullType[],
  timezone: TimeZone,
): LogType {
  return convertLogToClient(responseObject.log, quotaList, timezone);
}

export function convertUpdateItemResponseToClient(
  responseObject: UpdateItemResponseObjectType,
  quotaList: QuotaFullType[],
  timezone: TimeZone,
): LogType {
  return convertLogToClient(responseObject.log, quotaList, timezone);
}