import { z } from "zod";

export const OutcomeIdSchema = z.string().brand<"OutcomeId">();
export type OutcomeIdType = z.infer<typeof OutcomeIdSchema>;

export const OutcomeStatusList = ["preparing", "completed", "failed"] as const;
export const OutcomeStatusSchema = z.enum(OutcomeStatusList);
export type OutcomeStatusType = z.infer<typeof OutcomeStatusSchema>;