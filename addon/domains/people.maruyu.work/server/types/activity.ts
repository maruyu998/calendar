import { z } from "zod";
import { ResponseObjectType as FetchItemResponseObjectType } from "../../share/protocol/activity/fetchItem";
import { ResponseObjectType as CreateItemResponseObjectType } from "../../share/protocol/activity/createItem";
import { ResponseObjectType as UpdateItemResponseObjectType } from "../../share/protocol/activity/updateItem";
import { ResponseObjectType as DeleteItemResponseObjectType } from "../../share/protocol/activity/deleteItem";
import { RawActivityType } from "../process/activity";
import { getNameSummary } from "../utils/people";
import { HexColorSchema } from "@ymwc/utils";
import { PeopleSchema, PeopleType } from "../../share/types/people";
import { ActivityIdSchema } from "../../share/types/activity";

export const ActivitySchema = z.object({
  id: ActivityIdSchema,
  peopleList: z.array(PeopleSchema),
  startTime: z.date(),
  endTime: z.date(),
  title: z.string().optional(),
  description: z.string(),
  color: HexColorSchema.nullable(),
});

export type ActivityType = z.infer<typeof ActivitySchema>;


export function convertRawToFetchItemResponseObject(
  raw: RawActivityType,
):FetchItemResponseObjectType{
  return {
    activity: {
      id: raw.id,
      title: raw.title,
      peopleList: raw.peopleList.map(people=>({
        id: people.id,
        name: getNameSummary(people.name),
      })),
      startTime: raw.startTime,
      endTime: raw.endTime,
    }
  }
}

export function convertRawToCreateItemResponseObject(
  raw:RawActivityType
):CreateItemResponseObjectType{
  return {
    activity: {
      id: raw.id,
      title: raw.title,
      peopleList: raw.peopleList.map(people=>({
        id: people.id,
        name: getNameSummary(people.name),
      })),
      startTime: raw.startTime,
      endTime: raw.endTime,
    }
  }
}

export function convertRawToUpdateItemResponseObject(
  raw:RawActivityType
):UpdateItemResponseObjectType{
  return {
    activity: {
      id: raw.id,
      title: raw.title,
      peopleList: raw.peopleList.map(people=>({
        id: people.id,
        name: getNameSummary(people.name),
      })),
      startTime: raw.startTime,
      endTime: raw.endTime,
    }
  }
}

export function convertRawToDeleteItemResponseObject(
  raw:RawActivityType
):DeleteItemResponseObjectType{
  return {
    activity: {
      id: raw.id,
      title: raw.title,
      peopleList: raw.peopleList.map(people=>({
        id: people.id,
        name: getNameSummary(people.name),
      })),
      startTime: raw.startTime,
      endTime: raw.endTime,
    }
  }
}