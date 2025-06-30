import { z } from "zod";
import { CalendarSchema } from "@share/types/calendar";
import { DOMAIN } from "../../const";
import { CategorySchema } from "../../share/types/calendar";

export const TimeCalendarSchema = CalendarSchema
  .omit({
    calendarSource: true,
    uniqueKeyInSource: true,
  })
  .extend({
    calendarSource: z.literal(DOMAIN).brand("CalendarSource"),
    uniqueKeyInSource: CategorySchema.brand("UniqueKeyInSource"),
    data: z.object({
      category: CategorySchema,
    })
  });

export type TimeCalendarType = z.infer<typeof TimeCalendarSchema>;