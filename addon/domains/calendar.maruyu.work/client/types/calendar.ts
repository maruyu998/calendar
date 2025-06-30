import { z } from "zod";
import { CalendarSchema } from "@client/types/calendar";
import { DOMAIN } from "../../const";

export const DefaultCalendarSchema = CalendarSchema
  .omit({
    calendarSource: true,
  })
  .extend({
    calendarSource: z.literal(DOMAIN).brand("CalendarSource"),
  });

export type DefaultCalendarType = z.infer<typeof DefaultCalendarSchema>;