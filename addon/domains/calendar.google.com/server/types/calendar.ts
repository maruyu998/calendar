import { z } from "zod";
import { DOMAIN } from "../../const";
import { CalendarSchema, CalendarStyleDisplaySchema } from "@share/types/calendar";
import { HexColorSchema } from "maruyu-webcommons/commons/utils/color";
import { GoogleCalendarIdSchema } from "../../share/types/googleCalendar";

export const GCalAccessRoleSchema = z.enum(["owner", "reader", "writer", "freeBusyReader"]);
// export type GCalAccesRole = z.infer<typeof GCalAccessRoleSchema>;

export const GoogleCalendarSchema = CalendarSchema
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
      googleCalendarId: GoogleCalendarIdSchema,
      timezone: z.string(),
      accessRole: GCalAccessRoleSchema,
    })
  });

export type GoogleCalendarType = z.infer<typeof GoogleCalendarSchema>;