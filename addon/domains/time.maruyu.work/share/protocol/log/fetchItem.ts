import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { LogIdSchema, LogFetchItemFullResponseObjectSchema } from "@maruyu/time-sdk";

export const RequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
  id: LogIdSchema,
});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;

export const ResponseObjectSchema = LogFetchItemFullResponseObjectSchema;
export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;