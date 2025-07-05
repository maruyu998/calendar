import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { QuotaIdSchema, LogCreateItemResponseObjectSchema } from "@maruyu/time-sdk";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  quotaId: QuotaIdSchema,
  startTime: z.date(),
  endTime: z.date(),
  output: z.string(),
  review: z.string(),
})

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = LogCreateItemResponseObjectSchema;
export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;