import { z } from "zod";
import { TaskIdSchema, TaskWithFullSchema } from "./task";

export const TaskTimeIdSchema = z.string().brand<"TaskTimeId">();
export type TaskTimeIdType = z.infer<typeof TaskTimeIdSchema>;

export const TaskTimeSchema = z.object({
  id: TaskTimeIdSchema,
  taskId: TaskIdSchema,
  startTime: z.date(),
  endTime: z.date(),
  memo: z.string(),
  updatedTime: z.date(),
}).strict();
export type TaskTimeType = z.infer<typeof TaskTimeSchema>;

export const TaskTimeWithFullSchema = TaskTimeSchema.omit({
  taskId: true
}).extend({
  task: TaskWithFullSchema
}).strict();
export type TaskTimeWithFullType = z.infer<typeof TaskTimeWithFullSchema>;