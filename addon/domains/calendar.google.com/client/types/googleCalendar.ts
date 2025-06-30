import { z } from "zod";
import { CalendarSchema } from "@client/types/calendar";

export const GoogleCalendarSchema = CalendarSchema
  .omit({

  });

export type GoogleCalendarType = z.infer<typeof GoogleCalendarSchema>;