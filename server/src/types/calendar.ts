import {
  ResponseObjectType as FetchListResponseObjectType,
} from "@share/protocol/calendar/fetchList";
import { CalendarType } from "@share/types/calendar";

export function convertRawToFetchListResponseObject(
  raw: CalendarType[],
):FetchListResponseObjectType{
  return {
    calendarList: raw.map(rawCalendar=>{
      const { id, calendarSource, uniqueKeyInSource, name, description, permissions, style, data } = rawCalendar;
      return {
        id,
        calendarSource,
        uniqueKeyInSource,
        name,
        description,
        permissions,
        style,
        data,
      }
    })
  }
}