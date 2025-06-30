import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { DefaultCaleventIdSchema } from "../../types/defaultCalevent";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  id: DefaultCaleventIdSchema,
})

export type RequestBodyType = z.infer<typeof RequestBodySchema>;


export const ResponseObjectSchema = z.object({
  calevent: z.object({
    id: DefaultCaleventIdSchema,
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
