import { z } from "zod";
import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { TimeQuotaIdSchema, TimeQuotaIdType, TimeQuotaSchema } from "../../types/timeQuota";
import { TimeLogIdSchema, TimeLogIdType } from "../../types/timeLog";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  id: TimeLogIdSchema,
  start: z.number().int().positive().optional(),
  end: z.number().int().positive().optional(),
  timeQuotaId: TimeQuotaIdSchema.optional(),
  output: z.string().optional(),
  review: z.string().optional(),
}).transform(o=>({
  calendarId: o.calendarId,
  id: o.id,
  startMdate: o.start != undefined ? new Mdate(o.start) : undefined,
  endMdate: o.end != undefined ? new Mdate(o.end) : undefined,
  output: o.output,
  review: o.review,
}))

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export function createRequestBody({
  calendarId,
  id,
  timeQuotaId,
  startMdate,
  endMdate,
  output,
  review,
}:{
  calendarId: CalendarIdType,
  id: TimeLogIdType,
  timeQuotaId?: TimeQuotaIdType,
  startMdate?: Mdate,
  endMdate?: Mdate,
  output?: string,
  review?: string,
}):z.input<typeof RequestBodySchema>{
  const body = {
    calendarId, 
    id,
    start: startMdate != undefined ? startMdate.unix : undefined,
    end: endMdate != undefined ? endMdate.unix : undefined,
    timeQuotaId,
    output, 
    review,
  };
  return body;
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
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