import { z } from "zod";

export const ResponseObjectSchema = z.object({
  calendars: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    googleCalendarId: z.string(),
    timezone: z.string(),
    accessRole: z.enum(["owner", "reader", "writer", "freeBusyReader"]),
    color: z.string(),
    display: z.enum(["showInList", "hiddenInList"]),
  }))
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;