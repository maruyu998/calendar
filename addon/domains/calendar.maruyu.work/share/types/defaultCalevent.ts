import { z } from "zod";

export const DefaultCaleventIdSchema = z.string().brand<"DefaultCaleventId">();
export type DefaultCaleventIdType = z.infer<typeof DefaultCaleventIdSchema>;