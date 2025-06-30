import { z } from "zod";
import { HexColorSchema } from "maruyu-webcommons/commons/utils/color";
import { CalendarIdSchema } from "@share/types/calendar";
import { DefaultCaleventIdSchema } from "../../types/defaultCalevent";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  title: z.string(),
  description: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  isDateEvent: z.boolean(),
})

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  calevent: z.object({
    id: DefaultCaleventIdSchema,
    startTime: z.date(),
    endTime: z.date(),
    isAllDay: z.boolean(),
    summary: z.string(),
    description: z.string(),
    color: HexColorSchema.nullable(),
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;