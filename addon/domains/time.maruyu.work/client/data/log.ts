import { deletePacket, getPacket, postPacket, patchPacket } from "@ymwc/http";
import { DOMAIN_ENDPOINT } from "../../const";
import { 
  ResponseObjectSchema as FetchItemResponseObjectSchema,
  ResponseObjectType as FetchItemResponseObjectType,
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
} from "../../share/protocol/log/fetchItem";
import {
  ResponseObjectSchema as CreateItemResponseObjectSchema,
  ResponseObjectType as CreateItemResponseObjectType,
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
} from "../../share/protocol/log/createItem";
import {
  ResponseObjectSchema as UpdateItemResponseObjectSchema,
  ResponseObjectType as UpdateItemResponseObjectType,
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
} from "../../share/protocol/log/updateItem";
import {
  ResponseObjectSchema as DeleteItemResponseObjectSchema,
  ResponseObjectType as DeleteItemResponseObjectType,
  RequestBodySchema as DeleteItemRequestBodySchema,
  RequestBodyType as DeleteItemRequestBodyType,
} from "../../share/protocol/log/deleteItem";

export async function fetchLog(queryData: FetchItemRequestQueryType):Promise<FetchItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/log/item`, window.location.href);
  const querySchema = FetchItemRequestQuerySchema;
  const responseSchema = FetchItemResponseObjectSchema;
  return await getPacket({ url, queryData, querySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function createLog(bodyData: CreateItemRequestBodyType):Promise<CreateItemResponseObjectType>{
  console.assert(bodyData.startTime.getTime() < bodyData.endTime.getTime());
  const url = new URL(`${DOMAIN_ENDPOINT}/log/item`, window.location.href);
  const bodySchema = CreateItemRequestBodySchema;
  const responseSchema = CreateItemResponseObjectSchema;
  return await postPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function updateLog(bodyData: UpdateItemRequestBodyType):Promise<UpdateItemResponseObjectType>{
  const { startTime: s, endTime: e } = bodyData;
  if(s != undefined && e == undefined) throw new Error("endTime is needed when startTime is updated");
  if(e != undefined && s == undefined) throw new Error("startTime is needed when endTime is updated");
  if(s != undefined && e != undefined && s.getTime() >= e.getTime()) throw new Error("startTime is on or before endTime.");
  const url = new URL(`${DOMAIN_ENDPOINT}/log/item`, window.location.href);
  const bodySchema = UpdateItemRequestBodySchema;
  const responseSchema = UpdateItemResponseObjectSchema;
  return await patchPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function deleteLog(bodyData: DeleteItemRequestBodyType):Promise<DeleteItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/log/item`, window.location.href);
  const bodySchema = DeleteItemRequestBodySchema;
  const responseSchema = DeleteItemResponseObjectSchema;
  return await deletePacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}