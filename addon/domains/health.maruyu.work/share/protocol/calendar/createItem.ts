import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { HexColorSchema } from "@ymwc/utils";

export const RequestBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  color: HexColorSchema.optional(),
  externalServiceName: z.string().optional(),
});
export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  calendar: z.object({
    id: CalendarIdSchema,
    name: z.string(),
    description: z.string(),
    color: HexColorSchema,
    display: z.enum(["showInList", "hiddenInList"]),
    externalServiceName: z.string().optional(),
  }),
});
export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;