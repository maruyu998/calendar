import { CalendarIdType } from "@share/types/calendar";
import { CaleventIdType, CaleventType } from "@share/types/calevent";
import { RawFitbitNightEventType } from "./types/fitbitSleepLog";
import { RawWithingsNightEventType } from "./types/withingsSleepLog";
import { fetchNighteventList as fetchFitbitNighteventList } from "./process/fitbitSleepLog";
import { fetchNighteventList as fetchWithingsNighteventList } from "./process/withings";
import { CalendarSourceType } from "@share/types/calendar";
import { HexColorType } from "@ymwc/utils";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

function convertFitbitNighteventToCalevent(
  nightEvent: RawFitbitNightEventType,
  calendarId: CalendarIdType,
  backgroundColor?: HexColorType,
):CaleventType{
  return {
    id: nightEvent.id as unknown as CaleventIdType,
    calendarId,
    // calendarSource: "health.maruyu.work" as CalendarSourceType,
    title: nightEvent.title,
    // description: nightEvent.description,
    startTime: nightEvent.startTime,
    endTime: nightEvent.endTime,
    // createdAt: nightEvent.createdAt,
    updatedAt: nightEvent.updatedAt,
    permissions: ["read"],
    // display: "show",
    style: {
      mainColor: backgroundColor ?? null,
      isAllDay: false,
    },
    // isDeleted: false,
    // data: {
    //   externals: []
    // }
  }
}

function convertWithingsNighteventToCalevent(
  nightEvent: RawWithingsNightEventType,
  calendarId: CalendarIdType,
  backgroundColor?: HexColorType,
):CaleventType{
  return {
    id: nightEvent.id as CaleventIdType,
    calendarId,
    // calendarSource: "health.maruyu.work" as CalendarSourceType,
    title: nightEvent.title,
    // description: nightEvent.description,
    startTime: nightEvent.startTime,
    endTime: nightEvent.endTime,
    // createdAt: nightEvent.createdAt,
    updatedAt: nightEvent.updatedAt,
    permissions: ["read"],
    style: {
      mainColor: backgroundColor ?? null,
      isAllDay: false,
    }
    // display: "show",
    // isDeleted: false,
    // data: {
    //   externals: [{
    //     name: "withings",
    //     url: nightEvent.external.withings.url
    //   }]
    // }
  }
}

export async function fetchCalevent({
  userId,
  calendarId,
  startTime,
  endTime,
  externalServiceName,
  backgroundColor,
}:{
  userId: UserIdType,
  calendarId: CalendarIdType
  startTime: Date,
  endTime: Date,
  externalServiceName?: string,
  backgroundColor?: HexColorType,
}):Promise<CaleventType[]>{
  if(externalServiceName == "fitbit"){
    const nighteventList = await fetchFitbitNighteventList({ userId, startTime, endTime });
    const eventList = nighteventList.map(ne=>convertFitbitNighteventToCalevent(ne, calendarId, backgroundColor))
    return eventList;
  }
  if(externalServiceName == "withings"){
    const nighteventList = await fetchWithingsNighteventList({ userId, startTime, endTime });
    const eventList = nighteventList.map(ne=>convertWithingsNighteventToCalevent(ne, calendarId, backgroundColor))
    return eventList;
  }
  return [];
}