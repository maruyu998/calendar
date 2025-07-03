import { deletePacket, getPacket, postPacket, patchPacket } from "@ymwc/http";
import { DOMAIN_ENDPOINT } from "../../const";
import { 
  ResponseObjectSchema as FetchItemResponseObjectSchema,
  ResponseObjectType as FetchItemResponseObjectType,
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
} from "../../share/protocol/taskTime/fetchItem";
import {
  ResponseObjectSchema as CreateItemResponseObjectSchema,
  ResponseObjectType as CreateItemResponseObjectType,
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
} from "../../share/protocol/taskTime/createItem";
import {
  ResponseObjectSchema as UpdateItemResponseObjectSchema,
  ResponseObjectType as UpdateItemResponseObjectType,
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
} from "../../share/protocol/taskTime/updateItem";
import {
  ResponseObjectSchema as DeleteItemResponseObjectSchema,
  ResponseObjectType as DeleteItemResponseObjectType,
  RequestBodySchema as DeleteItemRequestBodySchema,
  RequestBodyType as DeleteItemRequestBodyType,
} from "../../share/protocol/taskTime/deleteItem";
import { CalendarIdType } from "@share/types/calendar";
import { TaskIdType } from "../../share/types/task";
import { TaskTimeIdType } from "../../share/types/taskTime";

export async function fetchTaskTime(queryData: FetchItemRequestQueryType):Promise<FetchItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/taskTime/item`, window.location.href);
  const querySchema = FetchItemRequestQuerySchema;
  const responseSchema = FetchItemResponseObjectSchema;
  return await getPacket({ url, queryData, querySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function createTaskTime(bodyData: CreateItemRequestBodyType):Promise<CreateItemResponseObjectType>{
  if(bodyData.startTime.getTime() >= bodyData.endTime.getTime())
    throw new Error("startTime must be earlier than endTime.");
  const url = new URL(`${DOMAIN_ENDPOINT}/taskTime/item`, window.location.href);
  const bodySchema = CreateItemRequestBodySchema;
  const responseSchema = CreateItemResponseObjectSchema;
  return await postPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function updateTaskTime(bodyData: UpdateItemRequestBodyType):Promise<UpdateItemResponseObjectType>{
  if(bodyData.startTime != undefined && bodyData.endTime == undefined) 
    throw new Error("endTime must be specified when startTime is specified.");
  if(bodyData.endTime != undefined && bodyData.startTime == undefined) 
    throw new Error("startTime must be specified when endTime is specified.");
  if(bodyData.startTime !== undefined && bodyData.endTime !== undefined 
    && bodyData.startTime.getTime() >= bodyData.endTime.getTime())
    throw new Error("startTime must be earlier than endTime.");
  const url = new URL(`${DOMAIN_ENDPOINT}/taskTime/item`, window.location.href);
  const bodySchema = UpdateItemRequestBodySchema;
  const responseSchema = UpdateItemResponseObjectSchema;
  return await patchPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function deleteTaskTime(bodyData: DeleteItemRequestBodyType):Promise<DeleteItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/taskTime/item`, window.location.href);
  const bodySchema = DeleteItemRequestBodySchema;
  const responseSchema = DeleteItemResponseObjectSchema;
  return await deletePacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}