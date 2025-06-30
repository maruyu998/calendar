import { z } from "zod";

export const FitbitSleepLogIdSchema = z.string().brand<"FitbitSleepLogId">();
export type FitbitSleepLogIdType = z.infer<typeof FitbitSleepLogIdSchema>;

export const FitbitIdSchema = z.string().brand<"FitbitId">();
export type FitbitIdType = z.infer<typeof FitbitIdSchema>;