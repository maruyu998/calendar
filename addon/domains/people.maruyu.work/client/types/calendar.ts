import { z } from "zod";
import { CalendarSchema } from "@client/types/calendar";
import { DOMAIN } from "../../const";

export const PeopleCalendarSchema = CalendarSchema
  .omit({
    calendarSource: true,
  })
  .extend({
    calendarSource: z.literal(DOMAIN).brand("CalendarSource"),
  });

export type PeopleCalendarType = z.infer<typeof PeopleCalendarSchema>;