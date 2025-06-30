import { z } from "zod";

export const PeopleIdSchema = z.string().brand<"PeopleId">();
export type PeopleIdType = z.infer<typeof PeopleIdSchema>;

export const PeopleSchema = z.object({
  id: PeopleIdSchema,
  name: z.string(),
});

export type PeopleType = z.infer<typeof PeopleSchema>;