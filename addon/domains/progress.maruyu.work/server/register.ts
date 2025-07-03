import { DOMAIN } from "../const"
import AbstractAddon from "@addon/server/addon";
import * as caleventWrapper from "./caleventWrapper";
import { ProgressCalendarSchema, ProgressCalendarType } from "./types/calendar";
import { CaleventIdType, CaleventType } from "@share/types/calevent";
import { CalendarType } from "@share/types/calendar";
import { validateCalendar } from "@addon/server/calendar";
import { TaskTimeIdType } from "../share/types/taskTime";
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
    const progressCalendar = validateCalendar(calendar, ProgressCalendarSchema) as ProgressCalendarType;
    return await caleventWrapper.fetchCalevent({
      userId, startTime, endTime,
      calendarId: progressCalendar.id,
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
    const progressCalendar = validateCalendar(calendar, ProgressCalendarSchema) as ProgressCalendarType;
    return await caleventWrapper.updateCalevent({
      userId, startTime, endTime,
      calendarId: progressCalendar.id,
      taskTimeId: caleventId as unknown as TaskTimeIdType,
    });
  }
}


export default (registerHandler: (domain: string, addon: typeof AbstractAddon) => void): void => {
  registerHandler(DOMAIN, Addon)
}