import { z } from "zod";
import { OutcomeIdSchema } from "./outcome";
import { HexColorSchema } from "@ymwc/utils";

export const ProjectIdSchema = z.string().brand<"ProjectId">();
export type ProjectIdType = z.infer<typeof ProjectIdSchema>;

// urgent   至急  締切が近く放置すると大きな問題になる
// high     高	  締切は少し先だが、重要性が高い
// medium   中    通常対応のタスク
// low      低    いつでもできるが今すぐでなくてよい
// optional 任意  やってもいいが、やらなくても支障ない
export const ProjectPriorityList = ["urgent","high","medium","low","optional"] as const;
export const ProjectPrioritySchema = z.enum(ProjectPriorityList);
export type ProjectPriorityType = z.infer<typeof ProjectPrioritySchema>;

// completed  タスクの作業がすべて完了し、目的を達成した状態
// cancelled  このタスクは中止または不要と判断され、実行されないことが決定した状態
// failed     period が設定されていて，現在時刻がその後であるとき．そして失敗しているとき．
export const ProjectClosingStatusList = ["completed", "failed", "cancelled"] as const;
export const ProjectClosingStatusSchema = z.enum(ProjectClosingStatusList);
export type ProjectClosingStatusType = z.infer<typeof ProjectClosingStatusSchema>;

// paused     進行していたタスクが一時的に中断されている状態
// waiting    外部要因などにより、自分では進行できず保留中の状
// reviewing  reviewer待ち
export const ProjectDeferStatusList = ["paused", "snoozed"] as const;
export const ProjectDeferStatusSchema = z.enum(ProjectDeferStatusList);
export type ProjectDeferStatusType = z.infer<typeof ProjectDeferStatusSchema>;

export const ProjectStatusLabelSchema = z.union([ProjectDeferStatusSchema, ProjectClosingStatusSchema, z.null()]);
export type ProjectStatusLabelType = z.infer<typeof ProjectStatusLabelSchema>;

export const ProjectSchema = z.object({
  id: ProjectIdSchema,
  title: z.string(),
  description: z.string(),
  parentProjectId: ProjectIdSchema.nullable(),
  startTime: z.date(),
  endTime: z.date(),
  dependsOn: z.array(OutcomeIdSchema),
  priority: ProjectPrioritySchema,
  status: z.object({
    label: ProjectStatusLabelSchema,
    note: z.string(),
    updatedTime: z.date(),
  }),
  snoozeTime: z.date().nullable(),
  eventLog: z.array(z.object({
    
  })),
  style: z.object({
    customColor: HexColorSchema.nullable(),
  }),
  updatedTime: z.date(),
}).strict();
export type ProjectType = z.infer<typeof ProjectSchema>;

export const ProjectWithFullSchema: z.ZodSchema = z.lazy(()=>ProjectSchema.omit({
  parentProjectId: true
}).extend({
  parentProject: ProjectWithFullSchema.nullable(),
}).strict());
export type ProjectWithFullType = z.infer<typeof ProjectWithFullSchema>;