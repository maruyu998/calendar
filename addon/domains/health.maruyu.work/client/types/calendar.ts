import { z } from "zod";
import { CalendarSchema } from "@client/types/calendar";
import { DOMAIN } from "../../const";

export const HealthCalendarSchema = CalendarSchema
  .omit({
    calendarSource: true,
  })
  .extend({
    calendarSource: z.literal(DOMAIN).brand("CalendarSource"),
    externalServiceName: z.string().optional()
  });

export type HealthCalendarType = z.infer<typeof HealthCalendarSchema>;