import { IsoStringType, Mdate, MdateTz, TimeZone } from "@ymwc/mdate";
import * as GcalEventList from "./process/googleCalevent";
import { CalendarIdType } from "@share/types/calendar";
import { CaleventIdType, CaleventType } from "@share/types/calevent";
import { calendar_v3 } from "googleapis";
import { HexColorType } from "@ymwc/utils";
import { GoogleCalendarIdType } from "../share/types/googleCalendar";
import { GoogleCaleventIdType } from "../share/types/googleCalevent";
import { convertColidToColor } from "../share/func/googleCalevent";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

type RawGoogleCaleventType = calendar_v3.Schema$Event;


function parseGcalDate(gdate:calendar_v3.Schema$EventDateTime):MdateTz{
  const timezone = (gdate.timeZone ?? "Asia/Tokyo") as TimeZone;
  if(gdate.dateTime) return MdateTz.parseFormat(gdate.dateTime, "YYYY-MM-DDYHH:mm:ss", timezone);
  if(gdate.date) return MdateTz.parseFormat(gdate.date, "YYYY-MM-DD", timezone);
  throw new Error("datetime and date is null on google calendar event");
}

function convertGcaleventToCalevent(
  rawGoogleCalevent: RawGoogleCaleventType,
  calendarId: CalendarIdType,
  defaultBackgroundColor: HexColorType,
):CaleventType{
  if(rawGoogleCalevent.start == undefined) throw new Error("rawGoogleCalevent.start is undefined");
  if(rawGoogleCalevent.end == undefined) throw new Error("rawGoogleCalevent.end is undefined");
  if(rawGoogleCalevent.id==null||rawGoogleCalevent.id==undefined) throw new Error("rawGoogleCalevent.id is empty");
  if(rawGoogleCalevent.updated==null||rawGoogleCalevent.updated==undefined) throw new Error("rawGoogleCalevent.updated is empty");
  const color = convertColidToColor(rawGoogleCalevent.colorId||0);
  const isAllDay = rawGoogleCalevent.start.date ? true : false;
  return {
    id: rawGoogleCalevent.id as CaleventIdType,
    calendarId: calendarId,
    // calendarSource: DOMAIN,
    title: rawGoogleCalevent.summary??"",
    // description: rawGoogleCalevent.description??"",
    startTime: parseGcalDate(rawGoogleCalevent.start).toDate(),
    endTime: parseGcalDate(rawGoogleCalevent.end).toDate(),
    // createdAt: rawGoogleCalevent.created ? new Date(rawGoogleCalevent.created) : null,
    updatedAt: new Date(rawGoogleCalevent.updated),
    permissions: ["read", "write", "edit", "delete"],
    style: {
      mainColor: (color == null) ? defaultBackgroundColor : color,
      isAllDay,
    },
    // display: "show",
    // isDeleted: false,
    // data: {
    //   eventId: rawGoogleCalevent.id,
    //   calendarId: googleCalendarId,
    //   url: rawGoogleCalevent.htmlLink??"",
    //   updatedAt: MdateTz.parseFormat(rawGoogleCalevent.updated, "YYYY-MM-DDTHH:mm:ss", timezone).toDate()
    // }
  };
}

export async function fetchCaleventByDateRange({
  userId,
  calendarId,
  googleCalendarId,
  startTime,
  endTime,
  defaultBackgroundColor,
}:{
  userId: UserIdType,
  calendarId: CalendarIdType,
  googleCalendarId: GoogleCalendarIdType,
  startTime: Date,
  endTime: Date,
  defaultBackgroundColor: HexColorType,
}){
  const gcaleventList = await GcalEventList.fetchEventListByDataRange({
    userId,
    googleCalendarId,
    timeMin: startTime.toISOString() as IsoStringType,
    timeMax: endTime.toISOString() as IsoStringType,
  });
  const eventList = gcaleventList.map(gcalevent=>(
    convertGcaleventToCalevent(gcalevent, calendarId, defaultBackgroundColor)
  ))
  return eventList;
}

export async function updateCalevent({
  userId,
  calendarId,
  googleCalendarId,
  googleCaleventId,
  startTime,
  endTime,
  defaultBackgroundColor,
}:{
  userId: UserIdType,
  calendarId: CalendarIdType,
  googleCalendarId: GoogleCalendarIdType,
  googleCaleventId: GoogleCaleventIdType,
  startTime?: Date,
  endTime?: Date,
  defaultBackgroundColor: HexColorType
}):Promise<CaleventType>{
  const gcalevent = await GcalEventList.updateEvent({ 
    userId, 
    calendarId: googleCalendarId,
    eventId: googleCaleventId,
    start: startTime ? { dateTime: startTime.toISOString() as IsoStringType } : {},
    end: endTime ? { dateTime: endTime.toISOString() as IsoStringType } : {},
  });
  return convertGcaleventToCalevent(gcalevent, calendarId, defaultBackgroundColor);
}