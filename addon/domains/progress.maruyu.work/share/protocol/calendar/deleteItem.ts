import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
});

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  data: z.object({
    deleted: z.boolean(),
  }),
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;