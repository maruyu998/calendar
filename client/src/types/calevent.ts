import { z } from "zod";
import { MdateTz, MdateTzSchema, TimeZone } from "@ymwc/mdate"
import { ResponseObjectType as FetchListResponseObjectType } from "@share/protocol/calevent/fetchList";
import { ResponseObjectType as UpdateItemResponseObjectType } from "@share/protocol/calevent/updateItem";
import { CaleventIdSchema, CaleventIdType, CaleventPermissionSchema } from "@share/types/calevent";

export type { CaleventIdType };
import { CalendarType } from "./calendar";
import { HexColorSchema, HexColorType } from "maruyu-webcommons/commons/utils/color";
import { CalendarIdSchema } from "@share/types/calendar";

export const CaleventSchema = z.object({
  id: CaleventIdSchema,
  title: z.string(),
  startMdate: MdateTzSchema,
  endMdate: MdateTzSchema,
  permissions: z.array(CaleventPermissionSchema),
  calendarId: CalendarIdSchema,
  style: z.object({
    mainColor: HexColorSchema,
    isAllDay: z.boolean(),
  }),
  data: z.record(z.any()).optional(),
  updatedAt: z.date(),
});

export type CaleventType = z.infer<typeof CaleventSchema>;

export function convertFetchListResponseToClient(
  responseObject: FetchListResponseObjectType,
  calendarList: CalendarType[],
  timezone: TimeZone,
):CaleventType[]{
  return responseObject.caleventList.map(calevent=>{
    const {
      id, calendarId, title,
      startTime, endTime, permissions,
      style, data, updatedAt,
    } = calevent;
    const calendar = calendarList.find(cal=>cal.id == calendarId);
    if(!calendar){
      console.error("Calendar could not be found in convertFetchListResponseToClient", calevent);
      console.log({calendarList});
      throw new Error("Calendar could not be found in convertUpdateItemResponseToClient");
    }
    return {
      id,
      title,
      startMdate: new MdateTz(startTime.getTime(), timezone),
      endMdate: new MdateTz(endTime.getTime(), timezone),
      permissions,
      calendarId,
      style: {
        ...style,
        mainColor: style.mainColor ?? calendar.style.color ?? "#333333" as HexColorType,
      },
      data,
      updatedAt,
    }
  }).filter(calevent=>calevent!=null)
}

export function convertUpdateItemResponseToClient(
  responseObject: UpdateItemResponseObjectType,
  calendarList: CalendarType[],
  timezone: TimeZone
):CaleventType{
  const {
    id, calendarId, title,
    startTime, endTime, permissions,
    style, data, updatedAt,
  } = responseObject.calevent;
  const calendar = calendarList.find(cal=>cal.id == calendarId);
  if(!calendar){
    console.error("Calendar could not be found in convertUpdateItemResponseToClient", responseObject.calevent);
    console.log({calendarList});
    throw new Error("Calendar could not be found in convertUpdateItemResponseToClient");
  }
  return {
    id,
    title,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
    permissions,
    calendarId,
    style: {
      ...style,
      mainColor: style.mainColor ?? calendar.style.color ?? "#333333" as HexColorType,
    },
    data,
    updatedAt,
  }
}