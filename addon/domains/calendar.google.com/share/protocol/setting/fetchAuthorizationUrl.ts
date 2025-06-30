import { z } from "zod";

export const ResponseObjectSchema = z.object({
  authorizationUrl: z.string()
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;