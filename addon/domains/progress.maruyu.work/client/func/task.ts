import { MdateTz, TimeZone } from "@ymwc/mdate";
import { 
  TaskIdType,
  TaskWithFullType as NativeTaskWithFullType
} from "../../share/types/task";
import { TaskType, TaskWithFullType } from "../types/task";
import { convertProjectWithFullToClient, getProjectList } from "./project";


export function aggregateTask(
  taskList:TaskWithFullType[], 
  searchKey:string|null
):{projectText:string, id:TaskIdType, title:string}[]{
  return taskList.map(task=>{
    const projectList = getProjectList(task.project);
    const projectText = projectList.reverse().join(" / ");
    return ({ projectText, id: task.id, title: task.title});
  })
  .filter(({projectText, id, title})=>{
    if(searchKey == null) return true;
    try{
      const regex = new RegExp(searchKey,"gi");
      if(projectText.match(regex)) return true;
      if(title.match(regex)) return true;
    }catch{
    }
    return false;
  })
  .sort((a,b)=>{
    if(a.projectText < b.projectText) return -1;
    if(a.projectText > b.projectText) return 1;
    if(a.title < b.title) return -1;
    if(a.title > b.title) return -1;
    return 0;
  })
}

export function createTitle(task:TaskWithFullType){
  return `[T]${task.title}<${getProjectList(task).join("/")}>`;
}

export function convertTaskWithFullToClient(
  nativeTask: NativeTaskWithFullType,
  timezone: TimeZone
):TaskWithFullType{
  const { project, deadlineTime, status, updatedTime, ...rest } = nativeTask;
  return {
    ...rest,
    deadlineMdate: deadlineTime && new MdateTz(deadlineTime.getTime(), timezone),
    updatedMdate: new MdateTz(updatedTime.getTime(), timezone),
    status: {
      label: status.label,
      note: status.note,
      updatedMdate: new MdateTz(status.updatedTime.getTime(), timezone),
    },
    project: convertProjectWithFullToClient(project, timezone)
  }
}