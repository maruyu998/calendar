import { z } from "zod";
import { TimePurposeSchema } from "./timePurpose"
import { HexColorSchema } from "@ymwc/utils";

export const TimeQuotaIdSchema = z.string().brand<"TimeQuotaId">();
export type TimeQuotaIdType = z.infer<typeof TimeQuotaIdSchema>;

export const TimeQuotaGenreList = ["SelfOrganization","ReviewAndPlanning","GrowthOrientedAction"] as const;
export const TimeQuotaGenreSchema = z.enum(TimeQuotaGenreList);
export type TimeQuotaGenreType = z.infer<typeof TimeQuotaGenreSchema>;

export const TimeQuotaSchema = z.object({
  id: TimeQuotaIdSchema,
  name: z.string(),
  timePurpose: TimePurposeSchema,
  genre: TimeQuotaGenreSchema,
  styles: z.object({
    color: HexColorSchema
  })
})

export type TimeQuotaType = z.infer<typeof TimeQuotaSchema>;