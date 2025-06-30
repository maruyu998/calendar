import { 
  ProjectWithFullType as NativeProjectWithFullType
} from "../../share/types/project";
import { MdateTz, TimeZone } from "maruyu-webcommons/commons/utils/mdate";
import { ProjectWithFullType } from "../types/project";

export function aggregateProject(
  projectList:ProjectWithFullType[], 
  searchKey:string|null
):{projectText:string, id:ProjectWithFullType, title:string}[]{
  return projectList.map(project=>{
    const purposes = new Array<string>();
    while(true) {
      purposes.push(project.title);
      if(project.parentProject == null) break;
      project = project.parentProject;
    }
    const projectText = purposes.reverse().join("/");
    return ({ projectText, id: project.id, title: project.title});
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

export function getProjectList(project:ProjectWithFullType):string[]{
  const projectList = new Array<string>();
  while(project){
    projectList.unshift(project.title)
    project = project.parentProject;
  }
  return projectList;
}

export function convertProjectWithFullToClient(
  nativeProject: NativeProjectWithFullType,
  timezone: TimeZone,
):ProjectWithFullType{
  const { parentProject, startTime, endTime, snoozeTime, updatedTime, status, ...rest } = nativeProject;
  return {
    ...rest,
    startMdate: new MdateTz(startTime.getTime(), timezone),
    endMdate: new MdateTz(endTime.getTime(), timezone),
    snoozeMdate: new MdateTz(snoozeTime.getTime(), timezone),
    updatedMdate: new MdateTz(updatedTime.getTime(), timezone),
    status: {
      label: status.label, 
      note: status.note,
      updatedMdate: new MdateTz(status.updatedTime.getTime(), timezone),
    },
    parentProject: parentProject && convertProjectWithFullToClient(parentProject, timezone)
  }
}