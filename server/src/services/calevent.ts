import { z } from "zod";
import { CalendarIdType } from "@share/types/calendar";
import { CaleventIdType, CaleventSchema, CaleventType } from "@share/types/calevent";
import AbstractAddon from "@addon/server/addon";
import { fetchCalendar } from "@addon/server/calendar";
import { InternalServerError } from "@ymwc/errors";
import { UserIdType } from "@server/types/user";

const calendarSourceHandlers: Record<string, typeof AbstractAddon> = {};
export function registerCalendarSourceHandler(source: string, handler: typeof AbstractAddon) {
  calendarSourceHandlers[source] = handler;
}

export async function fetchList({
  userId,
  calendarId,
  startTime,
  endTime
}:{
  userId: UserIdType,
  calendarId: CalendarIdType,
  startTime: Date,
  endTime: Date
}):Promise<CaleventType[]>{
  const calendar = await fetchCalendar({ userId, calendarId });
  const calendarSource = calendar.calendarSource;
  const handler = calendarSourceHandlers[calendarSource];
  if(!handler) throw new Error(`No handler registered for calendarSource=${calendarSource}`);
  const caleventList = await handler.fetchCaleventList({ userId, calendar, startTime, endTime });
  const { success, error, data:parsedCaleventList } = z.array(CaleventSchema).safeParse(caleventList);
  if(!success){
    console.error(error);
    throw new InternalServerError("Calevent Fetch List Failed. calevent does not match the schema.");
  }
  return parsedCaleventList;
}

export async function updateItem({
  userId,
  calendarId,
  caleventId,
  startTime,
  endTime
}:{
  userId: UserIdType,
  calendarId: CalendarIdType,
  caleventId: CaleventIdType,
  startTime?: Date,
  endTime?: Date,
}):Promise<CaleventType>{
  const calendar = await fetchCalendar({ userId, calendarId });
  const calendarSource = calendar.calendarSource;
  const handler = calendarSourceHandlers[calendarSource];
  if(!handler) throw new Error(`No handler registered for calendarSource=${calendarSource}`);
  return await handler.updateCaleventItem({ userId, calendar, caleventId, startTime, endTime });
}