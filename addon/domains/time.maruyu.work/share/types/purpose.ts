import { HexColorSchema } from "@ymwc/utils";
import { z } from "zod";

export const PurposeSchema: z.ZodSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    parentPurpose: PurposeSchema.nullable(),
    styles: z.object({
      color: HexColorSchema,
      order: z.number().optional(),
    }),
  })
);

export type PurposeType = z.infer<typeof PurposeSchema>;