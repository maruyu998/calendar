import { z } from "zod";
import { Mdate, TimeZoneSchema } from "@ymwc/mdate";
import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { DefaultCaleventIdSchema, DefaultCaleventIdType } from "../../types/defaultCalevent";


export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  caleventId: DefaultCaleventIdSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  isDateEvent: z.boolean().optional(),
});

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  calevent: z.object({
    id: DefaultCaleventIdSchema,
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
