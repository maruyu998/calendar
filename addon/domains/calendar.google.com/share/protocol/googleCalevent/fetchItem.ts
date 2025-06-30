import { z } from "zod";
import { GoogleCaleventDateSchema, GoogleCaleventIdSchema } from "../../types/googleCalevent";
import { CalendarIdSchema } from "@share/types/calendar";

export const RequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
  eventId: GoogleCaleventIdSchema,
})
.strict()

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;


export const ResponseObjectSchema = z.object({
  googleCalevent: z.object({
    eventId: GoogleCaleventIdSchema,
    url: z.string(),
    summary: z.string(),
    description: z.string(),
    colorId: z.number(),
    start: GoogleCaleventDateSchema,
    end: GoogleCaleventDateSchema,
  })
}).strict();

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
