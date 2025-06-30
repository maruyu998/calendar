import { z } from "zod";
import { CalendarIdSchema } from "./calendar";
import { HexColorSchema } from "maruyu-webcommons/commons";

export const CaleventIdSchema = z.string().brand<"CaleventId">();
export type CaleventIdType = z.infer<typeof CaleventIdSchema>;

export const CaleventPermissionList = ["read","write","edit","delete"] as const;
export const CaleventPermissionSchema = z.enum(CaleventPermissionList);
export type CaleventPermissionType = z.infer<typeof CaleventPermissionSchema>;

export const CaleventStyleDisplayList = ["show","hidden"] as const;
export const CaleventStyleDisplaySchema = z.enum(CaleventStyleDisplayList);
export type CaleventStyleDisplayType = z.infer<typeof CaleventStyleDisplaySchema>;

export const CaleventSchema = z.object({
  id: CaleventIdSchema,
  calendarId: CalendarIdSchema,
  title: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  permissions: z.array(CaleventPermissionSchema),
  updatedAt: z.date(),
  style: z.object({
    mainColor: HexColorSchema.nullable(),
    isAllDay: z.boolean(),
  }),
  data: z.record(z.any()).optional(),
});
export type CaleventType = z.infer<typeof CaleventSchema>;