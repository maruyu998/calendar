import { z } from "zod";
import { PurposeSchema } from "./purpose"
import { HexColorSchema } from "@ymwc/utils";
import { QuotaIdSchema, QuotaIdType } from "@maruyu/time-sdk";

export { QuotaIdSchema };
export type { QuotaIdType };

export const QuotaGenreList = ["SelfOrganization","ReviewAndPlanning","GrowthOrientedAction"] as const;
export const QuotaGenreSchema = z.enum(QuotaGenreList);
export type QuotaGenreType = z.infer<typeof QuotaGenreSchema>;

export const QuotaSchema = z.object({
  id: QuotaIdSchema,
  name: z.string(),
  purpose: PurposeSchema,
  genre: QuotaGenreSchema,
  styles: z.object({
    color: HexColorSchema
  })
})

export type QuotaType = z.infer<typeof QuotaSchema>;