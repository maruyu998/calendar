import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { QuotaIdSchema } from "../../types/quota";
import { LogIdSchema } from "../../types/log";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  id: LogIdSchema,
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  quotaId: QuotaIdSchema.optional(),
  output: z.string().optional(),
  review: z.string().optional(),
})

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

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