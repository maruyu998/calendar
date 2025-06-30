import { z } from "zod";

export const RequestQuerySchema = z.object({
  code: z.string()
})

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;

export const ResponseObjectSchema = z.object({
  success: z.boolean(),
  redirectUrl: z.string().optional()
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
