import { HexColorSchema } from "@ymwc/utils";
import { z } from "zod";

export const CalendarIdSchema = z.string().brand<"CalendarId">();
export type CalendarIdType = z.infer<typeof CalendarIdSchema>;

export const CalendarSourceSchema = z.string().brand<"CalendarSource">();
export type CalendarSourceType = z.infer<typeof CalendarSourceSchema>;

export const CalendarPermissionList = ["readList", "readItem", "writeItem", "editItem", "deleteItem"] as const;
export const CalendarPermissionSchema = z.enum(CalendarPermissionList);
export type CalendarPermissionType = z.infer<typeof CalendarPermissionSchema>;

export const CalendarStyleDisplayList = ["showInList", "hiddenInList"] as const;
export const CalendarStyleDisplaySchema = z.enum(CalendarStyleDisplayList);
export type CalendarStyleDisplayType = z.infer<typeof CalendarStyleDisplaySchema>;

export const CalendarUniqueKeyInSourceSchema = z.string().brand<"UniqueKeyInSource">();
export type CalendarUniqueKeyInSourceType = z.infer<typeof CalendarUniqueKeyInSourceSchema>;

export const CalendarSchema = z.object({
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
});
export type CalendarType = z.infer<typeof CalendarSchema>;