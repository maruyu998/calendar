import { CalendarIdSchema } from "@share/types/calendar";
import { QuotaFetchListFullResponseObjectSchema } from "@maruyu/time-sdk";
import { z } from "zod";

export const RequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;

export const ResponseObjectSchema = QuotaFetchListFullResponseObjectSchema;
export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;