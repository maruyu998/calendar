import { postPacket } from "@ymwc/http";
import { DOMAIN_ENDPOINT } from "../../const";
import {
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
  ResponseObjectSchema as CreateItemResponseObjectSchema,
  ResponseObjectType as CreateItemResponseObjectType,
} from "../../share/protocol/calendar/createItem";

export async function createCalendar(bodyData: CreateItemRequestBodyType): Promise<CreateItemResponseObjectType> {
  const url = new URL(`${DOMAIN_ENDPOINT}/calendar/item`, window.location.href);
  const bodySchema = CreateItemRequestBodySchema;
  const responseSchema = CreateItemResponseObjectSchema;
  return await postPacket({ url, bodyData, bodySchema, responseSchema })
    .catch(error => {
      console.error(error);
      throw error;
    });
}