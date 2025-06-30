import { z } from "zod";
import { CalendarSchema } from "@share/types/calendar";
import { UniqueKeySchema } from "../../share/types/calendar";
import { DOMAIN } from "../../const";

export const PeopleCalendarSchema = CalendarSchema
  .omit({
    calendarSource: true,
    uniqueKeyInSource: true,
  })
  .extend({
    calendarSource: z.literal(DOMAIN).brand("CalendarSource"),
    uniqueKeyInSource: UniqueKeySchema.brand("UniqueKeyInSource"),
  });

export type PeopleCalendarType = z.infer<typeof PeopleCalendarSchema>;