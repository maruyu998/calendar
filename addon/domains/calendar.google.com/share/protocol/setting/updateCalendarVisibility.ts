import { z } from "zod";

export const RequestBodySchema = z.object({
  calendarId: z.string(),
  display: z.enum(["showInList", "hiddenInList"]),
});

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.undefined();

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;