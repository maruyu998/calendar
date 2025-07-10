import { z } from "zod";
import { CalendarSchema } from "@share/types/calendar";
import { CategorySchema } from "../../share/types/calendar";
import { DOMAIN } from "../../const";

export const PeopleCalendarSchema = CalendarSchema
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

export type PeopleCalendarType = z.infer<typeof PeopleCalendarSchema>;