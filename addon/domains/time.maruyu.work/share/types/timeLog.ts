import { z } from "zod";

export const TimeLogIdSchema = z.string().brand<"TimeLogId">();
export type TimeLogIdType = z.infer<typeof TimeLogIdSchema>;