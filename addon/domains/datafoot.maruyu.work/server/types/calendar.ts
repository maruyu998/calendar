import { z } from "zod";
import { CalendarSchema, CalendarStyleDisplaySchema } from "@share/types/calendar";
import { DOMAIN } from "../../const";
import { HexColorSchema } from "@ymwc/utils";
import { CategorySchema } from "../../share/types/calendar";

export const DatafootCalendarSchema = CalendarSchema
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
    data: z.object({
      category: CategorySchema,
    })
  });

export type DatafootCalendarType = z.infer<typeof DatafootCalendarSchema>;