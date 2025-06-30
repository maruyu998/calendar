import { z } from "zod";
import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { CaleventIdSchema, CaleventIdType } from "@share/types/calevent";
import { HexColorSchema } from "maruyu-webcommons/commons/utils/color";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  caleventId: CaleventIdSchema,
  startTime: z.date(),
  endTime: z.date(),
});

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  log: z.object({
    id: z.string(),
    timeQuotaId: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    color: HexColorSchema,
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;