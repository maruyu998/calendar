import { z } from "zod";
import { CalendarIdSchema, CalendarSchema } from "@share/types/calendar";
import { HexColorSchema } from "@ymwc/utils";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  name: z.string().optional(),
  description: z.string().optional(),
  style: z.object({
    color: HexColorSchema.optional(),
    display: z.enum(["showInList", "hiddenInList"]).optional(),
  }).optional(),
});

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  data: z.object({
    updated: CalendarSchema,
  }),
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;