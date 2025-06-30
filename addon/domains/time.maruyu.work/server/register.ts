import { DOMAIN } from "../const"
import AbstractAddon from "@addon/server/addon";
import * as caleventWrapper from "./caleventWrapper";
import { TimeCalendarSchema, TimeCalendarType } from "./types/calendar";
import { CaleventType, CaleventIdType } from "@share/types/calevent";
import { CalendarIdType, CalendarType } from "@share/types/calendar";
import { validateCalendar } from "@addon/server/calendar";
import { LogIdType } from "../share/types/log";
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
    const timeCalendar = validateCalendar(calendar, TimeCalendarSchema);
    return await caleventWrapper.fetchCalevent({
      userId, startTime, endTime, 
      calendarId: timeCalendar.id as CalendarIdType,
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
    const timeCalendar = validateCalendar(calendar, TimeCalendarSchema);
    return await caleventWrapper.updateCalevent({
      userId, startTime, endTime,
      calendarId: timeCalendar.id as CalendarIdType,
      logId: caleventId as unknown as LogIdType,
    });
  }
}


export default (registerHandler: (domain: string, addon: typeof AbstractAddon) => void): void => {
  registerHandler(DOMAIN, Addon)
}