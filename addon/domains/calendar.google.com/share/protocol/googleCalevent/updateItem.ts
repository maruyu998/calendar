import { z } from "zod";
import { GoogleCaleventDateSchema, GoogleCaleventIdSchema } from "../../types/googleCalevent";
import { CalendarIdSchema } from "@share/types/calendar";


export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  eventId: GoogleCaleventIdSchema,
  summary: z.string().optional(),
  description: z.string().optional(),
  start: GoogleCaleventDateSchema.optional(),
  end: GoogleCaleventDateSchema.optional(),
  colorId: z.number().optional(),
})
.strict()

export type RequestBodyType = z.infer<typeof RequestBodySchema>;


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
