import { ProjectWithFullType } from "../types/project";

export function getProjectList(project:ProjectWithFullType):string[]{
  const projectList = new Array<string>();
  while(project){
    projectList.unshift(project.title)
    project = project.parentProject;
  }
  return projectList;
}