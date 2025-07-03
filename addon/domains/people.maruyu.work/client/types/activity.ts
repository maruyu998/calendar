import { z } from "zod";
import { ResponseObjectType as FetchItemResponseObjectType } from "../../share/protocol/activity/fetchItem";
import { ResponseObjectType as UpdateItemResponseObjectType } from "../../share/protocol/activity/updateItem";
import { ResponseObjectType as DeleteItemResponseObjectType } from "../../share/protocol/activity/deleteItem";
import { MdateTz, MdateTzSchema, TimeZone } from "@ymwc/mdate";
import { ActivityIdSchema } from "../../share/types/activity";
import { PeopleSchema } from "../../share/types/people";
import { ActivityType as ActivitySharedType } from "../../share/types/activity";

export const ActivitySchema = z.object({
  id: ActivityIdSchema,
  title: z.string().optional(),
  peopleList: z.array(PeopleSchema),
  startMdate: MdateTzSchema,
  endMdate: MdateTzSchema,
  memo: z.string().optional(),
});

export type ActivityType = z.infer<typeof ActivitySchema>;

export function convertActivityToClient(
  rawActivity: ActivitySharedType,
  timezone: TimeZone,
):ActivityType{
  const { startTime, endTime, ...rest } = rawActivity;
  return {
    ...rest,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
  }
}

export function convertFetchItemResponseToClient(
  responseObject:FetchItemResponseObjectType,
  timezone: TimeZone,
):ActivityType{
  return convertActivityToClient(responseObject.activity, timezone);
}

export function convertUpdateItemResponseToClient(
  responseObject:UpdateItemResponseObjectType,
  timezone: TimeZone,
):ActivityType{
  return convertActivityToClient(responseObject.activity, timezone);
}

export function convertDeleteItemResponseToClient(
  responseObject:DeleteItemResponseObjectType,
  timezone: TimeZone,
):ActivityType{
  return convertActivityToClient(responseObject.activity, timezone);
}