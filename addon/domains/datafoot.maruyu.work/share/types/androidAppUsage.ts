import { z } from "zod";

export const AndroidAppUsageIdSchema = z.string().brand<"AndroidAppUsageId">();
export type AndroidAppUsageIdType = z.infer<typeof AndroidAppUsageIdSchema>;

export const AndroidAppIdSchema = z.string().brand<"AndroidAppId">();
export type AndroidAppIdType = z.infer<typeof AndroidAppIdSchema>;