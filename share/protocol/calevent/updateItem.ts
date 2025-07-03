import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { CaleventIdSchema, CaleventPermissionSchema } from "@share/types/calevent";
import { HexColorSchema } from "@ymwc/utils";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  caleventId: CaleventIdSchema,
  startTime: z.date(),
  endTime: z.date(),
})

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  calevent: z.object({
    id: CaleventIdSchema,
    calendarId: CalendarIdSchema,
    title: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    updatedAt: z.date(),
    permissions: z.array(CaleventPermissionSchema),
    style: z.object({
      mainColor: HexColorSchema.nullable(),
      isAllDay: z.boolean(),
    }),
    data: z.record(z.any()).optional(),
  })
})

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;