import { DOMAIN } from "../const"
import AbstractAddon from "@addon/server/addon";
import * as caleventWrapper from "./caleventWrapper";
import { HealthCalendarSchema, HealthCalendarType } from "./types/calendar";
import { CalendarType } from "@share/types/calendar";
import { CaleventType } from "@share/types/calevent";
import { validateCalendar } from "@addon/server/calendar";
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
    const healthCalendar = validateCalendar(calendar, HealthCalendarSchema) as HealthCalendarType;
    return await caleventWrapper.fetchCalevent({
      userId, startTime, endTime,
      calendarId: healthCalendar.id,
      externalServiceName: healthCalendar.data.externalServiceName,
      backgroundColor: healthCalendar.style.color,
    });
  }
}


export default (registerHandler: (domain: string, addon: typeof AbstractAddon) => void): void => {
  registerHandler(DOMAIN, Addon)
}