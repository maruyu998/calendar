import { z } from "zod";
import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { FitbitIdSchema, FitbitSleepLogIdSchema, FitbitSleepLogIdType } from "../../types/fitbitSleepLog";

export const RequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
  id: FitbitSleepLogIdSchema,
});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;

export const ResponseObjectSchema = z.object({
  fitbitSleepLog: z.object({
    id: FitbitSleepLogIdSchema,
    title: z.string(),
    description: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    updatedAt: z.date(),
    fitbitId: FitbitIdSchema,
    fitbitInnerIndex: z.number(),
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
