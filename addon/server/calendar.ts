import { fetchItem as mongoFetchItem } from "@server/mongoose/CalendarModel";
import { CalendarIdType, CalendarSchema, CalendarType } from "@share/types/calendar";
import { UserIdType } from "maruyu-webcommons/commons/types/user";
import { InternalServerError } from "@ymwc/errors";
import { z } from "zod";

export function validateCalendar<T extends z.ZodRawShape>(
  calendar: CalendarType,
  calendarSchema: z.ZodObject<T>,
):z.infer<typeof calendarSchema>{
  const { success, error, data: parsedCalendar } = calendarSchema.safeParse(calendar);
  if(!success){
    console.dir(error.format(), { depth: null });
    throw new InternalServerError("[validateCalendar]:calendar schema does not match.");
  }
  return parsedCalendar;
}

export async function fetchCalendar({
  userId,
  calendarId,
}:{
  userId: UserIdType,
  calendarId: CalendarIdType,
}):Promise<CalendarType>{
  const calendar = await mongoFetchItem({ userId, calendarId });
  if(calendar == null) throw new InternalServerError("calendar is not found");
  const { success, error, data: parsedCalendar } = CalendarSchema.safeParse(calendar);
  if(!success){
    console.dir(error.format());
    throw new InternalServerError("[fetchCalendar]:calendar schema does not match.");
  }
  return parsedCalendar;
}

