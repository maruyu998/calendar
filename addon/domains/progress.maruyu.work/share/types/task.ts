import { z } from "zod";
import { ProjectIdSchema, ProjectWithFullSchema } from "./project";
import { OutcomeIdSchema } from "./outcome";
import { HexColorSchema } from "@ymwc/utils";

export const TaskIdSchema = z.string().brand<"TaskId">();
export type TaskIdType = z.infer<typeof TaskIdSchema>;

// urgent   至急  締切が近く放置すると大きな問題になる
// high     高	  締切は少し先だが、重要性が高い
// medium   中    通常対応のタスク
// low      低    いつでもできるが今すぐでなくてよい
// optional 任意  やってもいいが、やらなくても支障ない
export const TaskPriorityList = ["urgent","high","medium","low","optional"] as const;
export const TaskPrioritySchema = z.enum(TaskPriorityList);
export type TaskPriorityType = z.infer<typeof TaskPrioritySchema>;

// completed  タスクの作業がすべて完了し、目的を達成した状態
// cancelled  このタスクは中止または不要と判断され、実行されないことが決定した状態
// failed     period が設定されていて，現在時刻がその後であるとき．そして失敗しているとき．
export const TaskClosingStatusList = ["completed", "failed", "cancelled"] as const;
export const TaskClosingStatusSchema = z.enum(TaskClosingStatusList);
export type TaskClosingStatusType = z.infer<typeof TaskClosingStatusSchema>;

// paused     進行していたタスクが一時的に中断されている状態
// waiting    外部要因などにより、自分では進行できず保留中の状態
// reviewing  reviewer待ち
export const TaskDeferStatusList = ["paused", "waiting", "reviewing"] as const;
export const TaskDeferStatusSchema = z.enum(TaskDeferStatusList);
export type TaskDeferStatusType = z.infer<typeof TaskDeferStatusSchema>;

export const TaskStatusLabelSchema = z.union([TaskDeferStatusSchema, TaskClosingStatusSchema, z.null()]);
export type TaskStatusLabelType = z.infer<typeof TaskStatusLabelSchema>;

export const TaskRecurringIdSchema = z.string().brand<"TaskRecurringId">();
export type TaskRecurringIdType = z.infer<typeof TaskRecurringIdSchema>;

export const TaskSchema = z.object({
  id: TaskIdSchema,
  title: z.string(),
  description: z.string(),
  projectId: ProjectIdSchema,
  estimatedMinute: z.number(),
  deadlineTime: z.date().nullable(),
  dependsOn: z.array(OutcomeIdSchema),
  priority: TaskPrioritySchema,
  status: z.object({
    label: TaskStatusLabelSchema,
    note: z.string(),
    updatedTime: z.date(),
  }),
  recurringId: TaskRecurringIdSchema.nullable(),
  eventLog: z.array(z.object({

  })),
  style: z.object({
    customColor: HexColorSchema.nullable(),
  }),
  updatedTime: z.date(),
}).strict();
export type TaskType = z.infer<typeof TaskSchema>;

export const TaskWithFullSchema = TaskSchema.omit({
  projectId: true  
}).extend({
  project: ProjectWithFullSchema,
}).strict();
export type TaskWithFullType = z.infer<typeof TaskWithFullSchema>;