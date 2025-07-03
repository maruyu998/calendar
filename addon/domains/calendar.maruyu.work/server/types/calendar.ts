import { z } from "zod";
import { DOMAIN } from "../../const";
import { CalendarSchema, CalendarStyleDisplaySchema } from "@share/types/calendar";
import { HexColorSchema } from "@ymwc/utils";

export const DefaultCalendarSchema = CalendarSchema
  .omit({
    calendarSource: true,
    style: true,
    data: true,
  })
  .extend({
    calendarSource: z.literal(DOMAIN).brand("CalendarSource"),
    style: z.object({
      display: CalendarStyleDisplaySchema,
      color: HexColorSchema,
    }),
  });

export type DefaultCalendarType = z.infer<typeof DefaultCalendarSchema>;