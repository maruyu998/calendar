import { z } from "zod";
import { MdateTz, MdateTzSchema, TimeZone } from "maruyu-webcommons/commons/utils/mdate";
import { TaskTimeIdSchema } from "../../share/types/taskTime";
import { ResponseObjectType as FetchItemResponseObjectType } from "../../share/protocol/taskTime/fetchItem";
import { ResponseObjectType as CreateItemResponseObjectType } from "../../share/protocol/taskTime/createItem";
import { TaskIdSchema } from "../../share/types/task";
import { TaskWithFullSchema, TaskWithFullType } from "./task";
import { convertTaskWithFullToClient } from "../func/task";

export const TaskTimeSchema = z.object({
  id: TaskTimeIdSchema,
  taskId: TaskIdSchema,
  startMdate: MdateTzSchema,
  endMdate: MdateTzSchema,
  memo: z.string(),
  updatedMdate: MdateTzSchema,
}).strict();
export type TaskTimeType = z.infer<typeof TaskTimeSchema>;

export const TaskTimeWithFullSchema = TaskTimeSchema.omit({
  taskId: true
}).extend({
  task: TaskWithFullSchema
}).strict();
export type TaskTimeWithFullType = z.infer<typeof TaskTimeWithFullSchema>;

export function convertFetchItemResponseToClient(
  responseObject: FetchItemResponseObjectType,
  timezone: TimeZone,
):TaskTimeWithFullType{
  const { task, startTime, endTime, updatedTime, ...rest } = responseObject.taskTime;
  return {
    ...rest,
    task: convertTaskWithFullToClient(task, timezone),
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
    updatedMdate: new MdateTz(updatedTime.getTime(), timezone),
  }
}

export function convertCreateItemResponseToClient(
  responseObject: CreateItemResponseObjectType,
  taskList: TaskWithFullType[],
  timezone: TimeZone,
):TaskTimeWithFullType{
  const { taskId, startTime, endTime, updatedTime, ...rest } = responseObject.taskTime;
  const task = taskList.find(task=>task.id == taskId);
  if(task == undefined) throw new Error(`Task(id=${taskId}) is not found`);
  return {
    ...rest,
    task,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
    updatedMdate: new MdateTz(updatedTime.getTime(), timezone),
  }
}