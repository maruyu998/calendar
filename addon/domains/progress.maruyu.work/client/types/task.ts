import { z } from "zod";
import { MdateTz, MdateTzSchema, TimeZone } from "@ymwc/mdate";
import {
  ResponseObjectType as FetchListResponseObjectType
} from "../../share/protocol/task/fetchList";
import {
  ResponseObjectType as CreateItemResponseObjectType
} from "../../share/protocol/task/createItem";
import { TaskIdSchema, TaskPrioritySchema, TaskRecurringIdSchema, TaskStatusLabelSchema } from "../../share/types/task";
import { ProjectIdSchema } from "../../share/types/project";
import { OutcomeIdSchema } from "../../share/types/outcome";
import { HexColorSchema } from "maruyu-webcommons/commons/utils/color";
import { ProjectWithFullSchema, ProjectWithFullType } from "./project";

export const TaskSchema = z.object({
  id: TaskIdSchema,
  title: z.string(),
  description: z.string(),
  projectId: ProjectIdSchema,
  estimatedMinute: z.number(),
  deadlineMdate: MdateTzSchema.nullable(),
  dependsOn: z.array(OutcomeIdSchema),
  priority: TaskPrioritySchema,
  status: z.object({
    label: TaskStatusLabelSchema,
    note: z.string(),
    updatedMdate: MdateTzSchema,
  }),
  recurringId: TaskRecurringIdSchema.nullable(),
  eventLog: z.array(z.object({

  })),
  style: z.object({
    customColor: HexColorSchema.nullable(),
  }),
  updatedMdate: MdateTzSchema,
}).strict();
export type TaskType = z.infer<typeof TaskSchema>;

export const TaskWithFullSchema = TaskSchema.omit({
  projectId: true
}).extend({
  project: ProjectWithFullSchema,
}).strict();
export type TaskWithFullType = z.infer<typeof TaskWithFullSchema>;


export function convertFetchListResponseToClient(
  responseObject: FetchListResponseObjectType,
  timezone: TimeZone,
):TaskWithFullType[]{
  return responseObject.taskList.map(task=>{
    const { deadlineTime, status, updatedTime, ...taskRest } = task;
    return {
      ...taskRest,
      deadlineMdate: deadlineTime ? new MdateTz(deadlineTime.getTime(), timezone) : null,
      status: {
        label: status.label,
        note: status.note,
        updatedMdate: new MdateTz(status.updatedTime.getTime(), timezone),
      },
      updatedMdate: new MdateTz(updatedTime.getTime(), timezone),
    }
  });
}

export function convertCreateItemResponseToClient(
  responseObject: CreateItemResponseObjectType,
  projectList: ProjectWithFullType[],
  timezone: TimeZone,
):TaskWithFullType{
  const { projectId, deadlineTime, status, updatedTime, ...rest } = responseObject.task;
  const project = projectList.find(p=>p.id == projectId);
  if(project == undefined) throw new Error(`project(id=${projectId}) is not found`);
  return {
    ...rest,
    project,
    deadlineMdate: deadlineTime ? new MdateTz(deadlineTime.getTime(), timezone) : null,
    status: {
      label: status.label,
      note: status.note,
      updatedMdate: new MdateTz(status.updatedTime.getTime(), timezone),
    },
    updatedMdate: new MdateTz(updatedTime.getTime(), timezone),
  }
}
