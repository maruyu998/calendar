import { TaskWithFullType } from "../types/task";
import { getProjectList } from "./project";


export function createTitle(task:TaskWithFullType){
  return `[T]${task.title}<${getProjectList(task.project).join("/")}>`;
}