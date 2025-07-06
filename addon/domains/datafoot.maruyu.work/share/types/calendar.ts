import { z } from "zod";

export const CategoryList = ["androidAppUsage"] as const;
export const CategorySchema = z.enum(CategoryList);