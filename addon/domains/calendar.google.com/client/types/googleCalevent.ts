import { z } from "zod";
import { ResponseObjectType as FetchItemResponseObjectType } from "../../share/protocol/googleCalevent/fetchItem";
import { ResponseObjectType as CreateItemResponseObjectType } from "../../share/protocol/googleCalevent/createItem";
import { ResponseObjectType as UpdateItemResponseObjectType } from "../../share/protocol/googleCalevent/updateItem";
import { ResponseObjectType as DeleteItemResponseObjectType } from "../../share/protocol/googleCalevent/deleteItem";
import { GoogleCaleventDateSchema, GoogleCaleventIdSchema, GoogleCaleventIdType } from "../../share/types/googleCalevent";

export const GoogleCaleventSchema = z.object({
  eventId: GoogleCaleventIdSchema,
  url: z.string(),
  summary: z.string(),
  description: z.string(),
  colorId: z.number(),
  start: GoogleCaleventDateSchema,
  end: GoogleCaleventDateSchema,
});

export type GoogleCaleventType = z.infer<typeof GoogleCaleventSchema>;

export function convertFetchItemResponseToClient(
  responseObject: FetchItemResponseObjectType,
):GoogleCaleventType{
  return responseObject.googleCalevent;
}

export function convertCreateItemResponseToClient(
  responseObject: CreateItemResponseObjectType,
):GoogleCaleventType{
  return responseObject.googleCalevent;
}

export function convertUpdateItemResponseToClient(
  responseObject: UpdateItemResponseObjectType,
):GoogleCaleventType{
  return responseObject.googleCalevent;
}

export function convertDeleteItemResponseToClient(
  responseObject: DeleteItemResponseObjectType,
):GoogleCaleventIdType{
  const { eventId } = responseObject.googleCalevent;
  return eventId;
}