import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { CategorySchema } from "../../types/calendar";

export const RequestBodySchema = z.object({
  category: CategorySchema,
  title: z.string().optional(),
});
export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  calendar: z.object({
    id: CalendarIdSchema,
    title: z.string(),
    domain: z.string(),
    isEnabled: z.boolean(),
    data: z.object({
      category: CategorySchema,
    }),
  }),
});
export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;