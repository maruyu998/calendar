import { z } from "zod";
import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { TimeQuotaIdSchema, TimeQuotaSchema } from "../../types/timeQuota";
import { TimeLogIdSchema } from "../../types/timeLog";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  timeQuotaId: TimeQuotaIdSchema,
  start: z.number().int().positive(),
  end: z.number().int().positive(),
  output: z.string(),
  review: z.string(),
}).transform(o=>({
  calendarId: o.calendarId,
  timeQuotaId: o.timeQuotaId,
  startMdate: new Mdate(o.start),
  endMdate: new Mdate(o.end),
  output: o.output,
  review: o.review,
}))

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export function createRequestBody({
  calendarId,
  timeQuotaId,
  startMdate,
  endMdate,
  output,
  review,
}:{
  calendarId: CalendarIdType,
  timeQuotaId: string,
  startMdate: Mdate,
  endMdate: Mdate,
  output: string,
  review: string,
}):z.input<typeof RequestBodySchema>{
  const body = {
    calendarId, timeQuotaId,
    start: startMdate.unix,
    end: endMdate.unix,
    output, review,
  };
  return body;
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