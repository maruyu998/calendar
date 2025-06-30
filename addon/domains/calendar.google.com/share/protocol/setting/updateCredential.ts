import { z } from "zod";

export const RequestBodySchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUri: z.string()
})

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.undefined();

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
