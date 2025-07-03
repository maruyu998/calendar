import { z } from "zod";
import {
  TaskClosingStatusList, TaskClosingStatusType, TaskDeferStatusList, 
  TaskDeferStatusType, TaskIdSchema, TaskSchema, TaskStatusLabelSchema, TaskStatusLabelType, TaskWithFullSchema,
} from "../../../share/types/task";
import { ProjectIdSchema, ProjectPrioritySchema } from "../../../share/types/project";
import { OutcomeIdSchema } from "../../../share/types/outcome";
import { HexColorSchema } from "@ymwc/utils";

/////////////////////////////////////////////////////////////////////////////////////////////
//////////                           F E T C H   L I S T                           //////////
/////////////////////////////////////////////////////////////////////////////////////////////
export const FetchListRequestQuerySchema = z.object({
  projectId: ProjectIdSchema.optional(),
  start: z.coerce.number().optional(),
  end: z.coerce.number().optional(),
  statusLabel: TaskStatusLabelSchema.optional(),
})
.strict()
.refine(o=> (o.start !== undefined && o.end !== undefined) ? o.start < o.end : true, {
  message: "start must be before end when start and end is specified",
  path: ["start"]
})
.refine(o=>{
  if(o.statusLabel === undefined) return true;
  if(o.statusLabel === null) return true;
  if(TaskClosingStatusList.includes(o.statusLabel as TaskClosingStatusType)) return true;
  if(TaskDeferStatusList.includes(o.statusLabel as TaskDeferStatusType)) return true;
}, {
  message: "statusLabel is not proper.",
  path: ["statusLabel"]
});
export type FetchListRequestQueryType = z.infer<typeof FetchListRequestQuerySchema>;
export const FetchListResponseObjectSchema = z.object({
  taskList: z.array(TaskWithFullSchema)
}).strict();
export type FetchListResponseObjectType = z.infer<typeof FetchListResponseObjectSchema>;

/////////////////////////////////////////////////////////////////////////////////////////////
//////////                           F E T C H   I T E M                           //////////
/////////////////////////////////////////////////////////////////////////////////////////////
export const FetchItemRequestQuerySchema = z.object({ id: TaskIdSchema }).strict();
export type FetchItemRequestQueryType = z.infer<typeof FetchItemRequestQuerySchema>;
export const FetchItemResponseObjectSchema = z.object({
  task: TaskWithFullSchema
}).strict();
export type FetchItemResponseObjectType = z.infer<typeof FetchItemResponseObjectSchema>;

/////////////////////////////////////////////////////////////////////////////////////////////
//////////                          C R E A T E   I T E M                          //////////
/////////////////////////////////////////////////////////////////////////////////////////////
export const CreateItemRequestBodySchema = z.object({
  projectId: ProjectIdSchema,
  title: z.string(),
  description: z.string(),
  estimatedMinute: z.number(),
  priority: ProjectPrioritySchema,
  dependsOn: z.array(OutcomeIdSchema),
  style: z.object({
    customColor: HexColorSchema.nullable()
  }),
})
.strict();
export type CreateItemRequestBodyType = z.infer<typeof CreateItemRequestBodySchema>;
export const CreateItemResponseObjectSchema = z.object({
  task: TaskSchema
});
export type CreateItemResponseObjectType = z.infer<typeof CreateItemResponseObjectSchema>;