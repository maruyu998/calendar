import { postPacket, patchPacket, deletePacket } from "@ymwc/http";
import { DOMAIN_ENDPOINT } from "../../const";
import {
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
  ResponseObjectSchema as CreateItemResponseObjectSchema,
  ResponseObjectType as CreateItemResponseObjectType,
} from "../../share/protocol/calendar/createItem";
import {
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
  ResponseObjectSchema as UpdateItemResponseObjectSchema,
  ResponseObjectType as UpdateItemResponseObjectType,
} from "../../share/protocol/calendar/updateItem";
import {
  RequestBodySchema as DeleteItemRequestBodySchema,
  RequestBodyType as DeleteItemRequestBodyType,
  ResponseObjectSchema as DeleteItemResponseObjectSchema,
  ResponseObjectType as DeleteItemResponseObjectType,
} from "../../share/protocol/calendar/deleteItem";
import { CalendarIdType } from "@share/types/calendar";
import { HexColorType } from "@ymwc/utils";

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

export async function updateCalendar({
  calendarId,
  name,
  description,
  color,
  display,
  externalServiceName,
}: {
  calendarId: CalendarIdType;
  name?: string;
  description?: string;
  color?: HexColorType;
  display?: "showInList" | "hiddenInList";
  externalServiceName?: string;
}): Promise<UpdateItemResponseObjectType> {
  const url = new URL(`${DOMAIN_ENDPOINT}/calendar/item`, window.location.href);
  const bodyData: UpdateItemRequestBodyType = {
    calendarId,
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(color !== undefined && { color }),
    ...(display !== undefined && { display }),
    ...(externalServiceName !== undefined && { externalServiceName }),
  };
  const bodySchema = UpdateItemRequestBodySchema;
  const responseSchema = UpdateItemResponseObjectSchema;
  
  return await patchPacket({ url, bodyData, bodySchema, responseSchema })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export async function deleteCalendar({
  calendarId,
}: {
  calendarId: CalendarIdType;
}): Promise<DeleteItemResponseObjectType> {
  const url = new URL(`${DOMAIN_ENDPOINT}/calendar/item`, window.location.href);
  const bodyData: DeleteItemRequestBodyType = {
    calendarId,
  };
  const bodySchema = DeleteItemRequestBodySchema;
  const responseSchema = DeleteItemResponseObjectSchema;
  
  return await deletePacket({ url, bodyData, bodySchema, responseSchema })
    .catch(error => {
      console.error(error);
      throw error;
    });
}