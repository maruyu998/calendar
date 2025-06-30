import { z } from "zod";

export const InboxIdSchema = z.string().brand<"InboxId">();
export type InboxIdType = z.infer<typeof InboxIdSchema>;

export const InboxCategoryList = ["idea","question","issue","quick"] as const;
export const InboxCategorySchema = z.enum(InboxCategoryList);
export type InboxCategoryType = z.infer<typeof InboxCategorySchema>;