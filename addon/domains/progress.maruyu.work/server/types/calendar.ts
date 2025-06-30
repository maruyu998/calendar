import { z } from "zod";
import { CalendarSchema } from "@share/types/calendar";
import { DOMAIN } from "../../const";

export const ProgressCalendarSchema = CalendarSchema
  .omit({
    calendarSource: true,
  })
  .extend({
    calendarSource: z.literal(DOMAIN).brand("CalendarSource"),
  });

export type ProgressCalendarType = z.infer<typeof ProgressCalendarSchema>;