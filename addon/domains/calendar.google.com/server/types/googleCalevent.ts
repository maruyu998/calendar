import { MdateTz, MdateTzSchema } from "@ymwc/mdate";
import { z } from "zod";
import { calendar_v3 } from 'googleapis';
import { InternalServerError } from "@ymwc/errors";
import { ResponseObjectType as FetchItemResponseObjectType } from "../../share/protocol/googleCalevent/fetchItem";
import { ResponseObjectType as CreateItemResponseObjectType } from "../../share/protocol/googleCalevent/createItem";
import { ResponseObjectType as UpdateItemResponseObjectType } from "../../share/protocol/googleCalevent/updateItem";
import { ResponseObjectType as DeleteItemResponseObjectType } from "../../share/protocol/googleCalevent/deleteItem";
import { HexColorSchema } from "@ymwc/utils";
import { GoogleCalendarIdSchema } from "../../share/types/googleCalendar";
import { GoogleCaleventIdSchema, GoogleCaleventIdType, GoogleCaleventDateSchema } from "../../share/types/googleCalevent";

export type RawGoogleCaleventType = calendar_v3.Schema$Event;

export const GoogleCaleventSchema = z.object({
  googleCaleventId: GoogleCaleventIdSchema,
  googleCalendarId: GoogleCalendarIdSchema,
  googleCalendarUrl: z.string(),
  startMdate: MdateTzSchema,
  endMdate: MdateTzSchema,
  isAllDay: z.boolean(),
  summary: z.string(),
  description: z.string(),
  color: HexColorSchema.nullable(),
});

export type GoogleCaleventType = z.infer<typeof GoogleCaleventSchema>;

export function convertRawToFetchItemResponseObject(
  raw:RawGoogleCaleventType
):FetchItemResponseObjectType{
  if(raw.id==null||raw.id==undefined) throw new InternalServerError("raw.id is empty");
  if(raw.updated==null||raw.updated==undefined) throw new InternalServerError("raw.updated is empty");
  if(raw.start == undefined) throw new InternalServerError("raw.start is undefined");
  if(raw.end == undefined) throw new InternalServerError("raw.end is undefined");
  return {
    googleCalevent: {
      eventId: raw.id as GoogleCaleventIdType,
      url: raw.htmlLink ?? "",
      summary: raw.summary ?? "",
      description: raw.description ?? "",
      colorId: Number(raw.colorId||0),
      start: GoogleCaleventDateSchema.parse(raw.start),
      end: GoogleCaleventDateSchema.parse(raw.end),
    }
  }
}

export function convertRawToCreateItemResponseObject(
  raw:RawGoogleCaleventType
):CreateItemResponseObjectType{
  if(raw.id==null||raw.id==undefined) throw new InternalServerError("raw.id is empty");
  if(raw.updated==null||raw.updated==undefined) throw new InternalServerError("raw.updated is empty");
  if(raw.start == undefined) throw new InternalServerError("raw.start is undefined");
  if(raw.end == undefined) throw new InternalServerError("raw.end is undefined");
  return {
    googleCalevent: {
      eventId: raw.id as GoogleCaleventIdType,
      url: raw.htmlLink ?? "",
      summary: raw.summary ?? "",
      description: raw.description ?? "",
      colorId: Number(raw.colorId||0),
      start: GoogleCaleventDateSchema.parse(raw.start),
      end: GoogleCaleventDateSchema.parse(raw.end),
    }
  }
}

export function convertRawToUpdateItemResponseObject(
  raw:RawGoogleCaleventType
):UpdateItemResponseObjectType{
  if(raw.id==null||raw.id==undefined) throw new InternalServerError("raw.id is empty");
  if(raw.updated==null||raw.updated==undefined) throw new InternalServerError("raw.updated is empty");
  if(raw.start == undefined) throw new InternalServerError("raw.start is undefined");
  if(raw.end == undefined) throw new InternalServerError("raw.end is undefined");
  return {
    googleCalevent: {
      eventId: raw.id as GoogleCaleventIdType,
      url: raw.htmlLink ?? "",
      summary: raw.summary ?? "",
      description: raw.description ?? "",
      colorId: Number(raw.colorId||0),
      start: GoogleCaleventDateSchema.parse(raw.start),
      end: GoogleCaleventDateSchema.parse(raw.end),
    }
  }
}

export function convertRawToDeleteItemResponseObject(
  raw:RawGoogleCaleventType
):DeleteItemResponseObjectType{
  if(raw.id==null||raw.id==undefined) throw new InternalServerError("raw.id is empty");
  if(raw.updated==null||raw.updated==undefined) throw new InternalServerError("raw.updated is empty");
  if(raw.start == undefined) throw new InternalServerError("raw.start is undefined");
  if(raw.end == undefined) throw new InternalServerError("raw.end is undefined");
  return {
    googleCalevent: {
      eventId: raw.id as GoogleCaleventIdType,
    }
  }
}