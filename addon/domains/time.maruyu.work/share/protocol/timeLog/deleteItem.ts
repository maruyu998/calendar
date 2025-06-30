import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { z } from "zod";
import { TimeQuotaIdSchema, TimeQuotaSchema } from "../../types/timeQuota";
import { TimeLogIdSchema, TimeLogIdType } from "../../types/timeLog";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  id: TimeLogIdSchema,
})

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export function createRequestBody({
  calendarId,
  id,
}:{
  calendarId: CalendarIdType,
  id: TimeLogIdType,
}):RequestBodyType{
  const body = { calendarId, id };
  return body;
}


export const ResponseObjectSchema = z.object({
  timeLog: z.object({
    id: TimeLogIdSchema,
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;