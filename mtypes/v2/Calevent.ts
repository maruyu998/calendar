import mongoose from "mongoose";
import { CalendarIdType, CalendarSourceType, CalendarType } from "./Calendar";
import { MdateTz } from "maruyu-webcommons/commons/utils/mdate";

export type CaleventIdType = string;

export const CaleventPermissions = [
  "read","write","edit","delete"
] as const;
export type CaleventPermissionType = typeof CaleventPermissions[number];

export const CaleventStyleDisplays = ["show","hidden"] as const;
export type CaleventStyleDisplayType = typeof CaleventStyleDisplays[number];

type CaleventCommonType = {
  id: CaleventIdType,
  calendarId: CalendarIdType,
  calendarSource: CalendarSourceType,
  title: string,
  description: string,
  startTime: Date,
  endTime: Date,
  permissions?: CaleventPermissionType[],
  style: {
    isAllDay: boolean,
    display: CaleventStyleDisplayType
    mainColor?: string
  },
  isDeleted: boolean,
  data?: object
}

type GcalCaleventType = CaleventCommonType & {
  calendarSource: "calendar.google.com",
  data: {
    eventId: string,
    calendarId: string,
    url: string,
    updatedAt: Date
  }
}
type TimeCaleventType = CaleventCommonType & {
  calendarSource: "time.maruyu.work",
  data: {
    
  }
}
type McalCaleventType = CaleventCommonType & {
  calendarSource: "calendar.maruyu.work",
  data: {

  }
}
type HealthCaleventType = CaleventCommonType & {
  calendarSource: "health.maruyu.work",
  data: {
    externals: {
      url: string,
      name: string
    }[]
  }
}
type PeopleCaleventType = CaleventCommonType & {
  calendarSource: "people.maruyu.work",
  data: {
    // externals: {
    //   url: string,
    //   name: string
    // }[]
  }
}

export type CaleventType = GcalCaleventType
                          |TimeCaleventType
                          |McalCaleventType
                          |HealthCaleventType
                          |PeopleCaleventType;

export type CaleventMongoType = CaleventType & {
  _id: mongoose.Schema.Types.ObjectId,
  userId: string
}

type ExtendClientType = {
  startMdate: MdateTz,
  endMdate: MdateTz,
  calendar: CalendarType
}
type GcalCaleventClientType = 
  Omit<
    GcalCaleventType,
    "startTime"|"endTime"
  > & ExtendClientType
type TimeCaleventClientType = 
  Omit<
    TimeCaleventType,
    "startTime"|"endTime"
  > & ExtendClientType
type McalCaleventClientType = 
  Omit<
    McalCaleventType,
    "startTime"|"endTime"
  > & ExtendClientType
type HealthCaleventClientType = 
  Omit<
    HealthCaleventType,
    "startTime"|"endTime"
  > & ExtendClientType
type PeopleCaleventClientType = 
  Omit<
    PeopleCaleventType,
    "startTime"|"endTime"
  > & ExtendClientType

export type CaleventClientType = GcalCaleventClientType
                                |TimeCaleventClientType
                                |McalCaleventClientType
                                |HealthCaleventClientType
                                |PeopleCaleventClientType