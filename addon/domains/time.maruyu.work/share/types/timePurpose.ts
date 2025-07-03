import { HexColorSchema } from "@ymwc/utils";
import { z } from "zod";

export const TimePurposeSchema: z.ZodSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    parentPurpose: TimePurposeSchema.nullable(),
    styles: z.object({
      color: HexColorSchema,
      order: z.number().optional(),
    }),
  })
);

export type TimePurposeType = z.infer<typeof TimePurposeSchema>;