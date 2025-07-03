import { z } from "zod";
import { 
  ProjectClosingStatusList, ProjectClosingStatusType, ProjectDeferStatusList, 
  ProjectDeferStatusType, ProjectIdSchema, ProjectIdType, ProjectPrioritySchema, 
  ProjectStatusLabelSchema, ProjectStatusLabelType,
} from "../../../share/types/project";
import { OutcomeIdSchema } from "../../../share/types/outcome";
import { HexColorSchema } from "@ymwc/utils";

export const ProjectWithFullSchema: z.ZodSchema = z.lazy(()=>z.object({
  id: ProjectIdSchema,
  title: z.string(),
  description: z.string(),
  parentProject: ProjectWithFullSchema.nullable(),
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
}))

/////////////////////////////////////////////////////////////////////////////////////////////
//////////                           F E T C H   L I S T                           //////////
/////////////////////////////////////////////////////////////////////////////////////////////
export const FetchListRequestQuerySchema = z.object({
  parentProjectId: ProjectIdSchema.optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  statusLabel: ProjectStatusLabelSchema.optional(),
  hierarchyPosition: z.enum(["top","bottom"]).optional(),
})
.strict()
.refine(o=>(o.startTime && o.endTime) ? o.startTime.getTime() < o.endTime.getTime() : true, {
  message: "startTime must be before endTime when startTime and endTime is specified",
  path: ["startTime"]
})
.refine(o=>{
  if(o.statusLabel === undefined) return true;
  if(o.statusLabel === null) return true;
  if(ProjectClosingStatusList.includes(o.statusLabel as ProjectClosingStatusType)) return true;
  if(ProjectDeferStatusList.includes(o.statusLabel as ProjectDeferStatusType)) return true;
  return false;
}, {
  message: "statusLabel is not proper.",
  path: ["statusLabel"]
})
.refine(o=>{
  if(o.hierarchyPosition == undefined) return true;
  if(["top","bottom"].includes(o.hierarchyPosition)) return true;
  return false;
}, {
  message: "hierarchyPosition is not proper.",
  path: ["hierarchyPosition"]
});
export type FetchListRequestQueryType = z.infer<typeof FetchListRequestQuerySchema>;
export const FetchListResponseObjectSchema = z.object({
  projectList: z.array(ProjectWithFullSchema)
}).strict();
export type FetchListResponseObjectType = z.infer<typeof FetchListResponseObjectSchema>;

/////////////////////////////////////////////////////////////////////////////////////////////
//////////                           F E T C H   I T E M                           //////////
/////////////////////////////////////////////////////////////////////////////////////////////
export const FetchItemRequestQuerySchema = z.object({ id: ProjectIdSchema }).strict();
export type FetchItemRequestQueryType = z.infer<typeof FetchItemRequestQuerySchema>;
export const FetchItemResponseObjectSchema = z.object({
  project: ProjectWithFullSchema
}).strict();
export type FetchItemResponseObjectType = z.infer<typeof FetchItemResponseObjectSchema>;