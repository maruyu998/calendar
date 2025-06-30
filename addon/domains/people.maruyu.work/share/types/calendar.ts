import { z } from "zod";

export const UniqueKeyList = ["activity", "birthday"] as const;
export const UniqueKeySchema = z.enum(UniqueKeyList);