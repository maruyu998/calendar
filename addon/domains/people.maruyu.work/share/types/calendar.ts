import { z } from "zod";

export const CategoryList = ["activity", "birthday"] as const;
export const CategorySchema = z.enum(CategoryList);