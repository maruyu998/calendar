import { DOMAIN } from "../const"
import AbstractAddon from "@addon/server/addon";
import { PeopleCalendarSchema } from "./types/calendar";
import { CalendarType } from "@share/types/calendar";
import { CaleventIdType, CaleventType } from "@share/types/calevent";
import * as exPeActivityCaleventWrapper from "./activityCaleventWrapper";
import * as exPeBirthdayCaleventWrapper from "./birthdayCaleventWrapper";
import { validateCalendar } from "@addon/server/calendar";
import { ActivityIdType } from "../share/types/activity";
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
    const peopleCalendar = validateCalendar(calendar, PeopleCalendarSchema);
    if(peopleCalendar.uniqueKeyInSource == "activity"){
      return await exPeActivityCaleventWrapper.fetchCalevent({
        userId, startTime, endTime,
        calendarId: peopleCalendar.id,
      });
    }
    if(peopleCalendar.uniqueKeyInSource == "birthday"){
      return await exPeBirthdayCaleventWrapper.fetchCalevent({
        userId, startTime, endTime,
        calendarId: peopleCalendar.id,
        timeZone: "Asia/Tokyo"
      });
    }
    throw new Error("Not implemented Error");
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
    const peopleCalendar = validateCalendar(calendar, PeopleCalendarSchema);
    if(peopleCalendar.uniqueKeyInSource == "activity"){
      return await exPeActivityCaleventWrapper.updateCalevent({
        userId, startTime, endTime,
        calendarId: peopleCalendar.id,
        activityId: caleventId as unknown as ActivityIdType,
      });
    }
    if(peopleCalendar.uniqueKeyInSource == "birthday"){
      throw new Error("writing people.maruyu.work birthday is not implemented and not allowed");
    }
    throw new Error("Not implemented Error");
  }
}


export default (registerHandler: (domain: string, addon: typeof AbstractAddon) => void): void => {
  registerHandler(DOMAIN, Addon)
}