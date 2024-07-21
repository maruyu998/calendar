import mongoose from "mongoose";

export type GCalAccesRole = 'owner'|"reader"|'writer'|'freeBusyReader'

export type CalendarIdType = string;

export const CalendarSources = [
  "calendar.maruyu.work",
  "calendar.google.com", 
  "time.maruyu.work",
  "health.maruyu.work",
  "people.maruyu.work",
] as const;

export type CalendarSourceType = typeof CalendarSources[number];

export const CalendarPermissions = [
  "readList","readItem","writeItem","editItem","deleteItem"
] as const;
export type CalendarPermissionType = typeof CalendarPermissions[number];

export const CalendarStyleDisplays = ["showInList","hiddenInList"] as const;
export type CalendarStyleDisplayType = typeof CalendarStyleDisplays[number];

type CalendarCommonType = {
  id: CalendarIdType,
  calendarSource: CalendarSourceType,
  uniqueKeyInSource?: string,
  name: string,
  description: string,
  permissions: CalendarPermissionType[],
  style: {
    display: CalendarStyleDisplayType
  },
  data?: object
}

type GcalCalendarType = CalendarCommonType & {
  calendarSource: "calendar.google.com",
  uniqueKeyInSource: string,
  data: {
    timezone: string,
    accessRole: GCalAccesRole,
    backgroundColor: string,
  }
}
type MtimeCalendarType = CalendarCommonType & {
  calendarSource: "time.maruyu.work",
  uniqueKeyInSource: "record"|"budget",
  data: {}
}
type MCalendarType = CalendarCommonType & {
  calendarSource: "calendar.maruyu.work",
  data: {
    backgroundColor: string
  }
}
type HCalendarType = CalendarCommonType & {
  calendarSource: "health.maruyu.work",
  data: {
    backgroundColor: string
    externalServiceName?: string
  }
}
type PCalendarType = CalendarCommonType & {
  calendarSource: "people.maruyu.work",
  data: {
    // backgroundColor: string
    // externalServiceName?: string
  }
}

export type CalendarType = GcalCalendarType
                          |MtimeCalendarType
                          |MCalendarType
                          |HCalendarType
                          |PCalendarType;

export type CalendarMongoType = CalendarType & {
  _id: mongoose.Schema.Types.ObjectId,
  userId: string
}