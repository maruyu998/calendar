import { CalendarSourceType, CalendarType } from "@client/types/calendar";
import { Setting as CalendarGoogleCom } from "../../domains/calendar.google.com/client";
// import CalendarMaruyuWork from "../../domains/calendar.maruyu.work/client/form/Setting";
import { Setting as DatafootMaruyuWork } from "../../domains/datafoot.maruyu.work/client";
import { Setting as HealthMaruyuWork } from "../../domains/health.maruyu.work/client";
import { Setting as PeopleMaruyuWork } from "../../domains/people.maruyu.work/client";
import { Setting as ProgressMaruyuWork } from "../../domains/progress.maruyu.work/client";
import { Setting as TimeMaruyuWork } from "../../domains/time.maruyu.work/client";

export default function SettingForm(props:{
  calendarSource: CalendarSourceType,
  closeModal: ()=>void,
}){
  if(props.calendarSource == "calendar.google.com") return <CalendarGoogleCom closeModal={props.closeModal}/>;
  // if(props.calendarSource == "calendar.maruyu.work") return <CalendarMaruyuWork {...props}/>;
  if(props.calendarSource == "datafoot.maruyu.work") return <DatafootMaruyuWork closeModal={props.closeModal}/>;
  if(props.calendarSource == "health.maruyu.work") return <HealthMaruyuWork closeModal={props.closeModal}/>;
  if(props.calendarSource == "people.maruyu.work") return <PeopleMaruyuWork closeModal={props.closeModal}/>;
  if(props.calendarSource == "progress.maruyu.work") return <ProgressMaruyuWork closeModal={props.closeModal}/>;
  if(props.calendarSource == "time.maruyu.work") return <TimeMaruyuWork closeModal={props.closeModal}/>;
  return <p>Not Implemented {props.calendarSource}</p>
}