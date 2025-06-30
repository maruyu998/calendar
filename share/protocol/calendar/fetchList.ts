import { z } from "zod";
import {
  CalendarIdSchema,
  CalendarSourceSchema,
  CalendarPermissionSchema,
  CalendarStyleDisplaySchema,
  CalendarUniqueKeyInSourceSchema,
} from "@share/types/calendar";
import { HexColorSchema } from "maruyu-webcommons/commons/utils/color";

const RequestQuerySchema = z.object({

});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;

export const ResponseObjectSchema = z.object({
  calendarList: z.array(z.object({
    id: CalendarIdSchema,
    calendarSource: CalendarSourceSchema,
    uniqueKeyInSource: CalendarUniqueKeyInSourceSchema,
    name: z.string(),
    description: z.string(),
    permissions: z.array(CalendarPermissionSchema),
    style: z.object({
      display: CalendarStyleDisplaySchema,
      color: HexColorSchema,
    }),
    data: z.record(z.any()).optional(),
  }))
})

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;