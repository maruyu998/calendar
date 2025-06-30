import { z } from "zod";
import { QuotaSchema } from "./quota";

export const LogIdSchema = z.string().brand<"LogId">();
export type LogIdType = z.infer<typeof LogIdSchema>;

export const LogSchema = z.object({
  id: LogIdSchema,
  quota: QuotaSchema,
  startTime: z.date(),
  endTime: z.date(),
  output: z.string(),
  review: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type LogType = z.infer<typeof LogSchema>;