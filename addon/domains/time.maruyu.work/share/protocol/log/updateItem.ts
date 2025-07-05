import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { QuotaIdSchema, LogIdSchema, LogUpdateItemResponseObjectSchema } from "@maruyu/time-sdk";

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

export const ResponseObjectSchema = LogUpdateItemResponseObjectSchema;
export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;