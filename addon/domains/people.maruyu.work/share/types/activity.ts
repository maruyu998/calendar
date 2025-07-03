import { z } from "zod";
import { HexColorSchema } from "@ymwc/utils";
import { PeopleSchema, PeopleType } from "./people";

export const ActivityIdSchema = z.string().brand<"ActivityId">();
export type ActivityIdType = z.infer<typeof ActivityIdSchema>;

export const ActivitySchema = z.object({
  id: ActivityIdSchema,
  peopleList: z.array(PeopleSchema),
  startTime: z.date(),
  endTime: z.date(),
  title: z.string().optional(),
  memo: z.string().optional(),
  // 将来的に追加予定
  // color: HexColorSchema.nullable(),
});

export type ActivityType = z.infer<typeof ActivitySchema>;