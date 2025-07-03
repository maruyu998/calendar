import { getPacket, patchPacket } from "@ymwc/http";
import {
  ResponseObjectSchema as FetchListResponseObjectSchema,
  ResponseObjectType as FetchListResponseObjectType,
  RequestQuerySchema as FetchListRequestQuerySchema,
  RequestQueryType as FetchListRequestQueryType,
} from "@share/protocol/calevent/fetchList";
import {
  ResponseObjectSchema as UpdateItemResponseObjectSchema,
  ResponseObjectType as UpdateItemResponseObjectType,
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
} from "@share/protocol/calevent/updateItem";

export async function fetchCaleventList(queryData:FetchListRequestQueryType):Promise<FetchListResponseObjectType>{
  const url = new URL('/sec/apsh/calevent/list', window.location.href);
  const querySchema = FetchListRequestQuerySchema;
  const responseSchema = FetchListResponseObjectSchema;
  return await getPacket({ url, queryData, querySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function updateCalevent(bodyData:UpdateItemRequestBodyType):Promise<UpdateItemResponseObjectType>{
  console.assert(bodyData.startTime.getTime() < bodyData.endTime.getTime());
  const url = new URL('/sec/apsh/calevent/item', window.location.href);
  const bodySchema = UpdateItemRequestBodySchema;
  const responseSchema = UpdateItemResponseObjectSchema;
  return await patchPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}