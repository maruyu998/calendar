import { z } from "zod";
import { MdateTz, MdateTzSchema } from "@ymwc/mdate";

export const AndroidAppUsageSchema = z.object({
  id: z.string(),
  appId: z.string(),
  appName: z.string(),
  startMdate: MdateTzSchema,
  endMdate: MdateTzSchema,
  updatedAt: z.date(),
});

export type AndroidAppUsageType = z.infer<typeof AndroidAppUsageSchema>;