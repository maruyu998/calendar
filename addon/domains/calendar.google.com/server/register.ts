import { DOMAIN } from "../const"
import AbstractAddon from "@addon/server/addon";
import * as caleventWrapper from "./caleventWrapper";
import { GoogleCalendarSchema, GoogleCalendarType } from "./types/calendar";
import { CaleventType, CaleventIdType } from "@share/types/calevent";
import { CalendarType } from "@share/types/calendar";
import { validateCalendar } from "@addon/server/calendar";
import { GoogleCaleventIdType } from "../share/types/googleCalevent";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

class Addon extends AbstractAddon {
  static async fetchCaleventList({
    userId,
    calendar,
    startTime,
    endTime,
  }:{
    userId: UserIdType,
    calendar: CalendarType,
    startTime: Date,
    endTime: Date,
  }):Promise<CaleventType[]>{
    const googleCalendar = validateCalendar(calendar, GoogleCalendarSchema); // as GoogleCalendarType;
    return await caleventWrapper.fetchCaleventByDateRange({
      userId, startTime, endTime,
      calendarId: googleCalendar.id,
      googleCalendarId: googleCalendar.data.googleCalendarId,
      defaultBackgroundColor: googleCalendar.style.color,
    });
  }

  static async updateCaleventItem({
    userId,
    calendar,
    caleventId,
    startTime,
    endTime,
  }:{
    userId: UserIdType,
    calendar: CalendarType,
    caleventId: CaleventIdType,
    startTime?: Date,
    endTime?: Date,
  }):Promise<CaleventType>{
    const googleCalendar = validateCalendar(calendar, GoogleCalendarSchema); // as GoogleCalendarType;
    const googleCaleventId = caleventId as unknown as GoogleCaleventIdType;
    return await caleventWrapper.updateCalevent({
      userId, startTime, endTime,
      calendarId: googleCalendar.id,
      googleCalendarId: googleCalendar.data.googleCalendarId,
      googleCaleventId: googleCaleventId,
      defaultBackgroundColor: googleCalendar.style.color,
    })
  }
}


export default function(registerHandler: (domain: string, addon: typeof AbstractAddon) => void): void {
  registerHandler(DOMAIN, Addon);
}