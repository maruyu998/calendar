import { z } from "zod";
import { Mdate, MdateTzSchema } from "maruyu-webcommons/commons/utils/mdate";
import {
  CalendarIdType,
  CalendarIdSchema,
} from "@share/types/calendar";
import {
  CaleventIdSchema,
  CaleventPermissionSchema,
  // CaleventStyleDisplaySchema,
} from "@share/types/calevent";
import { HexColorSchema } from "maruyu-webcommons/commons/utils/color";

export const RequestQuerySchema = z.object({
  calendarIdList: z.array(CalendarIdSchema),
  startTime: z.date(),
  endTime: z.date(),
});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;

// createRequestQuery function removed - use props directly with queryData


export const ResponseObjectSchema = z.object({
  caleventList: z.array(z.object({
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
  }))
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;