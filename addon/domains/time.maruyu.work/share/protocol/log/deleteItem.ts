import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { z } from "zod";
import { QuotaIdSchema, QuotaSchema } from "../../types/quota";
import { LogIdSchema, LogIdType } from "../../types/log";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  id: LogIdSchema,
})

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  log: z.object({
    id: LogIdSchema,
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;