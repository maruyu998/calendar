import { DOMAIN } from "../const"
import { Mdate } from "@ymwc/mdate";
import * as caleventWrapper from "./caleventWrapper";
import { DatafootCalendarSchema, DatafootCalendarType } from "./types/calendar";
import AbstractAddon from "@addon/server/addon";
import { validateCalendar } from "@addon/server/calendar";
import { CalendarType } from "@share/types/calendar";
import { CaleventType } from "@share/types/calevent";
import { UserIdType } from "@server/types/user";

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
    const datafootCalendar = validateCalendar(calendar, DatafootCalendarSchema) as DatafootCalendarType;
    return await caleventWrapper.fetchCalevent({
      userId, startTime, endTime,
      calendarId: datafootCalendar.id,
      category: datafootCalendar.data.category,
      backgroundColor: datafootCalendar.style.color,
    });
  }
}


export default function(registerHandler: (domain: string, addon: typeof AbstractAddon) => void): void {
  registerHandler(DOMAIN, Addon)
}