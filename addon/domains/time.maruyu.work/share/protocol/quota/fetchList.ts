import { CalendarIdSchema } from "@share/types/calendar";
import { QuotaSchema } from "../../types/quota";
import { z } from "zod";

export const RequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;


export const ResponseObjectSchema = z.object({
  quotaList: z.array(QuotaSchema)
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;