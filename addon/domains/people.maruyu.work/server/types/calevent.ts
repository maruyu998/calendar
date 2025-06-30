import { CalendarType as CalendarCommonType } from "@server/types/calendar";
import { DOMAIN } from "../../const";

export type CalendarType = CalendarCommonType & {
  calendarSource: typeof DOMAIN,
  data: {
    // externalServiceName?: string
  }
}