import { z } from "zod";
import { CalendarSchema } from "@client/types/calendar";
import { DOMAIN } from "../../const";

export const ProgressCalendarSchema = CalendarSchema
  .omit({
    calendarSource: true,
  })
  .extend({
    calendarSource: z.literal(DOMAIN).brand("CalendarSource"),
    // data: z.object({
    // })
  });

export type ProgressCalendarType = z.infer<typeof ProgressCalendarSchema>;