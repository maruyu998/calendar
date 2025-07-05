import { CalendarIdSchema } from "@share/types/calendar";
import { z } from "zod";
import { LogIdSchema } from "@maruyu/time-sdk";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  id: LogIdSchema,
})

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.undefined();
export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;