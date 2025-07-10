import { z } from "zod";
import { CalendarSchema } from "@share/types/calendar";

export const RequestBodySchema = z.object({
  name: z.string(),
  description: z.string(),
});

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  data: z.object({
    created: CalendarSchema,
  }),
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;