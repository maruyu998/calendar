import { z } from "zod";
import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { DefaultCaleventIdSchema, DefaultCaleventIdType } from "../../types/defaultCalevent";

export const RequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
  id: DefaultCaleventIdSchema,
})

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;


export const ResponseObjectSchema = z.object({
  calevent: z.object({
    id: DefaultCaleventIdSchema,
    title: z.string(),
    description: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    updatedAt: z.date(),
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
