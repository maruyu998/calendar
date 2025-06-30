import { deletePacket, getPacket, postPacket, patchPacket } from "maruyu-webcommons/commons/utils/fetch";
import { DOMAIN_ENDPOINT } from "../../const";
import {
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
  ResponseObjectSchema as FetchItemResponseObjectSchema,
  ResponseObjectType as FetchItemResponseObjectType,
} from "../../share/protocol/calevent/fetchItem";
import {
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
  ResponseObjectSchema as CreateItemResponseObjectSchema,
  ResponseObjectType as CreateItemResponseObjectType,
} from "../../share/protocol/calevent/createItem";
import {
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
  ResponseObjectSchema as UpdateItemResponseObjectSchema,
  ResponseObjectType as UpdateItemResponseObjectType,
} from "../../share/protocol/calevent/updateItem";
import {
  RequestBodySchema as DeleteItemRequestBodySchema,
  RequestBodyType as DeleteItemRequestBodyType,
  ResponseObjectSchema as DeleteItemResponseObjectSchema,
  ResponseObjectType as DeleteItemResponseObjectType,
} from "../../share/protocol/calevent/deleteItem";

export async function fetchCalevent(queryData:FetchItemRequestQueryType):Promise<FetchItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/calevent/item`, window.location.href);
  const querySchema = FetchItemRequestQuerySchema;
  const responseSchema = FetchItemResponseObjectSchema;
  return await getPacket({ url, queryData, querySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function createCalevent(bodyData:CreateItemRequestBodyType):Promise<CreateItemResponseObjectType>{
  console.assert(bodyData.startTime.getTime() < bodyData.endTime.getTime());
  const url = new URL(`${DOMAIN_ENDPOINT}/calevent/item`, window.location.href);
  const bodySchema = CreateItemRequestBodySchema;
  const responseSchema = CreateItemResponseObjectSchema;
  return await postPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function updateCalevent(bodyData:UpdateItemRequestBodyType):Promise<UpdateItemResponseObjectType>{
  console.assert(bodyData.startTime.getTime() < bodyData.endTime.getTime())
  const url = new URL(`${DOMAIN_ENDPOINT}/calevent/item`, window.location.href);
  const bodySchema = UpdateItemRequestBodySchema;
  const responseSchema = UpdateItemResponseObjectSchema;
  return await patchPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function deleteCalevent(bodyData:DeleteItemRequestBodyType):Promise<DeleteItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/calevent/item`, window.location.href);
  const bodySchema = DeleteItemRequestBodySchema;
  const responseSchema = DeleteItemResponseObjectSchema;
  return await deletePacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}