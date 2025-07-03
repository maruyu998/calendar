import { deletePacket, getPacket, postPacket, patchPacket } from "@ymwc/http";
import { DOMAIN_ENDPOINT } from "../../const";
import {
  ResponseObjectSchema as FetchItemResponseObjectSchema,
  ResponseObjectType as FetchItemResponseObjectType,
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
} from "../../share/protocol/googleCalevent/fetchItem";
import {
  ResponseObjectSchema as CreateItemResponseObjectSchema,
  ResponseObjectType as CreateItemResponseObjectType,
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
} from "../../share/protocol/googleCalevent/createItem";
import {
  ResponseObjectSchema as UpdateItemResponseObjectSchema,
  ResponseObjectType as UpdateItemResponseObjectType,
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
} from "../../share/protocol/googleCalevent/updateItem";
import {
  ResponseObjectSchema as DeleteItemResponseObjectSchema,
  ResponseObjectType as DeleteItemResponseObjectType,
  RequestBodySchema as DeleteItemRequestBodySchema,
  RequestBodyType as DeleteItemRequestBodyType,
} from "../../share/protocol/googleCalevent/deleteItem";

export async function fetchGoogleCalevent(queryData: FetchItemRequestQueryType):Promise<FetchItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/googleCalevent/item`, window.location.href);
  const querySchema = FetchItemRequestQuerySchema;
  const responseSchema = FetchItemResponseObjectSchema;
  return await getPacket({ url, queryData, querySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function createGoogleCalevent(bodyData: CreateItemRequestBodyType):Promise<CreateItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/googleCalevent/item`, window.location.href);
  const bodySchema = CreateItemRequestBodySchema;
  const responseSchema = CreateItemResponseObjectSchema;
  return await postPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function updateGoogleCalevent(bodyData: UpdateItemRequestBodyType):Promise<UpdateItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/googleCalevent/item`, window.location.href);
  const bodySchema = UpdateItemRequestBodySchema;
  const responseSchema = UpdateItemResponseObjectSchema;
  return await patchPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function deleteGoogleCalevent(bodyData: DeleteItemRequestBodyType):Promise<DeleteItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/googleCalevent/item`, window.location.href);
  const bodySchema = DeleteItemRequestBodySchema;
  const responseSchema = DeleteItemResponseObjectSchema;
  return await deletePacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}