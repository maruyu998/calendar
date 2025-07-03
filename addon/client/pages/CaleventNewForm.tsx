import { MdateTz, TimeZone } from "@ymwc/mdate";
import { CalendarType } from "@client/types/calendar";
import { CaleventType } from "@client/types/calevent";

import { CaleventNew as CalendarGoogleCom } from "@addon/domains/calendar.google.com/client";
import CalendarMaruyuWork from "@addon/domains/calendar.maruyu.work/client/form/CaleventNew";
import { CaleventNew as DatafootMaruyuWork } from "@addon/domains/datafoot.maruyu.work/client";
import { CaleventNew as HealthMaruyuWork } from "@addon/domains/health.maruyu.work/client";
import { CaleventNew as PeopleMaruyuWork } from "@addon/domains/people.maruyu.work/client";
import { CaleventNew as ProgressMaruyuWork } from "@addon/domains/progress.maruyu.work/client";
import { CaleventNew as TimeMaruyuWork } from "@addon/domains/time.maruyu.work/client";


export default function CaleventNewForm(props:{
  clickedDate: MdateTz,
  timezone: TimeZone,
  calendar: CalendarType,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  closeModal: ()=>void,
}){
  if(props.calendar.calendarSource == "calendar.google.com") return <CalendarGoogleCom {...props}/>;
  if(props.calendar.calendarSource == "calendar.maruyu.work") return <CalendarMaruyuWork {...props}/>;
  if(props.calendar.calendarSource == "datafoot.maruyu.work") return <DatafootMaruyuWork {...props}/>;
  if(props.calendar.calendarSource == "health.maruyu.work") return <HealthMaruyuWork {...props}/>;
  if(props.calendar.calendarSource == "people.maruyu.work") return <PeopleMaruyuWork {...props}/>;
  if(props.calendar.calendarSource == "progress.maruyu.work") return <ProgressMaruyuWork {...props}/>;
  if(props.calendar.calendarSource == "time.maruyu.work") return <TimeMaruyuWork {...props}/>;
  return <p>Not Implemented {props.calendar.calendarSource}</p>
}