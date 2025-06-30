import { z } from "zod";

export const CategoryList = ["record", "budget"] as const;
export const CategorySchema = z.enum(CategoryList);