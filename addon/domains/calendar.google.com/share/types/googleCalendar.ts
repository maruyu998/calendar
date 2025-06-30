import { z } from "zod";

export const GoogleCalendarIdSchema = z.string().brand<"GoogleCalendarId">();
export type GoogleCalendarIdType = z.infer<typeof GoogleCalendarIdSchema>;