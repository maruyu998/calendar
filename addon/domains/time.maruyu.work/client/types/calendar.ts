import { z } from "zod";
import { CalendarSchema } from "@client/types/calendar";
import { DOMAIN } from "../../const";
import { CategorySchema } from "../../share/types/calendar";

export const TimeCalendarSchema = CalendarSchema
  .omit({
    calendarSource: true,
    data: true,
  })
  .extend({
    calendarSource: z.literal(DOMAIN).brand("CalendarSource"),
    data: z.object({
      category: CategorySchema,
    }),
  });

export type TimeCalendarType = z.infer<typeof TimeCalendarSchema>;