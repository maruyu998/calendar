import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { QuotaIdSchema } from "../../types/quota";
import { LogIdSchema } from "../../types/log";


export const RequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
  id: LogIdSchema,
});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;


export const ResponseObjectSchema = z.object({
  log: z.object({
    id: LogIdSchema,
    quotaId: QuotaIdSchema,
    startTime: z.date(),
    endTime: z.date(),
    output: z.string(),
    review: z.string(),
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;