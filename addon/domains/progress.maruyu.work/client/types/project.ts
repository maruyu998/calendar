import { z } from "zod";
import { MdateSchema, TimeZone } from "maruyu-webcommons/commons/utils/mdate";
import {
  ResponseObjectType as FetchListResponseObjectType
} from "../../share/protocol/project/fetchList";
import { ProjectIdSchema, ProjectPrioritySchema, ProjectStatusLabelSchema } from "../../share/types/project";
import { OutcomeIdSchema } from "../../share/types/outcome";
import { HexColorSchema } from "maruyu-webcommons/commons/utils/color";

export const ProjectSchema = z.object({
  id: ProjectIdSchema,
  title: z.string(),
  description: z.string(),
  parentProjectId: ProjectIdSchema.nullable(),
  startMdate: MdateSchema,
  endMdate: MdateSchema,
  dependsOn: z.array(OutcomeIdSchema),
  priority: ProjectPrioritySchema,
  status: z.object({
    label: ProjectStatusLabelSchema,
    note: z.string(),
    updatedMdate: MdateSchema,
  }),
  snoozeMdate: MdateSchema.nullable(),
  eventLog: z.array(z.object({
    
  })),
  style: z.object({
    customColor: HexColorSchema.nullable(),
  }),
  updatedMdate: MdateSchema,
}).strict();
export type ProjectType = z.infer<typeof ProjectSchema>;

export const ProjectWithFullSchema: z.ZodSchema = z.lazy(()=>ProjectSchema.omit({
  parentProjectId: true
}).extend({
  parentProject: ProjectWithFullSchema.nullable(),
}).strict());
export type ProjectWithFullType = z.infer<typeof ProjectWithFullSchema>;

export function convertFetchListResponseToClient(
  responseObject: FetchListResponseObjectType,
  timezone: TimeZone,
):ProjectWithFullType[]{
  return responseObject.projectList;
}
