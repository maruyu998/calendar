import { 
  fetchItem as mongoFetchItem,
  updateItem as mongoUpdateItem 
} from "@server/mongoose/CalendarModel";
import { 
  CalendarIdType, 
  CalendarSchema, 
  CalendarType,
  CalendarSourceType,
  CalendarUniqueKeyInSourceType,
  CalendarPermissionType,
  CalendarStyleDisplayType
} from "@share/types/calendar";
import { UserIdType } from "@server/types/user";
import { InternalServerError } from "@ymwc/errors";
import { HexColorType } from "@ymwc/utils";
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

export async function replaceCalendar<T extends z.ZodRawShape>({
  userId,
  calendarSource,
  uniqueKeyInSource,
  name,
  description,
  permissions,
  style,
  data,
  calendarSchema,
}:{
  userId: UserIdType,
  calendarSource: CalendarSourceType,
  uniqueKeyInSource: CalendarUniqueKeyInSourceType,
  name: string,
  description: string,
  permissions: CalendarPermissionType[],
  style: {
    display: CalendarStyleDisplayType,
    color: HexColorType,
  },
  data: Record<string, any>,
  calendarSchema: z.ZodObject<T>,
}):Promise<z.infer<typeof calendarSchema>>{
  const mongoCalendar = await mongoUpdateItem({ 
    userId, 
    calendarSource,
    uniqueKeyInSource,
    name, 
    description,
    permissions,
    style,
    data 
  });
  
  // Convert mongo result to CalendarType format
  const calendar: CalendarType = {
    id: mongoCalendar.id,
    calendarSource: mongoCalendar.calendarSource,
    uniqueKeyInSource: mongoCalendar.uniqueKeyInSource,
    name: mongoCalendar.name,
    description: mongoCalendar.description,
    permissions: mongoCalendar.permissions,
    style: mongoCalendar.style,
    data: mongoCalendar.data,
  };
  
  return validateCalendar(calendar, calendarSchema);
}