import { z } from "zod";
import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { AndroidAppIdSchema, AndroidAppUsageIdSchema, AndroidAppUsageIdType } from "../../types/androidAppUsage";

export const RequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
  id: AndroidAppUsageIdSchema,
});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;

export const ResponseObjectSchema = z.object({
  appUsage: z.object({
    id: AndroidAppUsageIdSchema,
    appId: AndroidAppIdSchema,
    appName: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    updatedAt: z.date(),
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
