import { z } from "zod";
import { CalendarSchema, CalendarStyleDisplaySchema } from "@share/types/calendar";
import { DOMAIN } from "../../const";
import { HexColorSchema } from "@ymwc/utils";

export const HealthCalendarSchema = CalendarSchema
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
      externalServiceName: z.string().optional(),
    })
  });

export type HealthCalendarType = z.infer<typeof HealthCalendarSchema>;