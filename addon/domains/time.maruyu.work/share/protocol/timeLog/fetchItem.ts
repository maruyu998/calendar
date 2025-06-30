import { z } from "zod";
import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { TimeQuotaIdSchema, TimeQuotaSchema } from "../../types/timeQuota";
import { TimeLogIdSchema, TimeLogIdType } from "../../types/timeLog";

const RawRequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
  id: TimeLogIdSchema,
}).transform(o=>({
  calendarId: o.calendarId,
  id: o.id,
}) as Record<string, string>);

export const RequestQuerySchema = z.object({
  calendarId: z.string(),
  id: z.string(),
}).transform(o=>({
  calendarId: o.calendarId as CalendarIdType,
  id: o.id as TimeLogIdType,
}));

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;

export function createRequestQuery({
  calendarId,
  id,
}:{
  calendarId: CalendarIdType,
  id: TimeLogIdType,
}):URLSearchParams{
  const query = RawRequestQuerySchema.parse({ calendarId, id });
  return new URLSearchParams(query);
}


export const ResponseObjectSchema = z.object({
  timeLog: z.object({
    id: TimeLogIdSchema,
    timeQuotaId: TimeQuotaIdSchema,
    start: z.number().int().positive(),
    end: z.number().int().positive(),
    output: z.string(),
    review: z.string(),
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;