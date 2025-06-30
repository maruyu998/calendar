import { z } from "zod";

export const RequestBodySchema = z.undefined();

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.undefined();

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;