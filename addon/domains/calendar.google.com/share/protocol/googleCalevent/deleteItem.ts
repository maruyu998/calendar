import { z } from "zod";
import { GoogleCaleventIdSchema } from "../../types/googleCalevent";
import { CalendarIdSchema } from "@share/types/calendar";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  eventId: GoogleCaleventIdSchema,
}).strict()

export type RequestBodyType = z.infer<typeof RequestBodySchema>;


export const ResponseObjectSchema = z.object({
  googleCalevent: z.object({
    eventId: GoogleCaleventIdSchema,
  })
}).strict();

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
