import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { TimeQuotaSchema } from "../../types/timeQuota";
import { z } from "zod";

const RawRequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
}).transform(o=>({
  calendarId: o.calendarId
}) as Record<string, string>);

export const RequestQuerySchema = z.object({
  calendarId: z.string(),
}).transform(o=>({
  calendarId: o.calendarId as CalendarIdType,
}));

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;

export function createRequestQuery({
  calendarId,
}:{
  calendarId: CalendarIdType,
}):URLSearchParams{
  const query = RawRequestQuerySchema.parse({
    calendarId,
  });
  return new URLSearchParams(query);
}

export const ResponseObjectSchema = z.object({
  timeQuotaList: z.array(TimeQuotaSchema)
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;