import { CalendarType } from "@client/types/calendar";
import { CaleventIdType, CaleventType } from "@client/types/calevent";
import { TimeZone } from "@ymwc/mdate";

import { CaleventEdit as CalendarGoogleCom } from "@addon/domains/calendar.google.com/client";
import CalendarMaruyuWork from "@addon/domains/calendar.maruyu.work/client/form/CaleventEdit";
import { CaleventEdit as DatafootMaruyuWork } from "@addon/domains/datafoot.maruyu.work/client";
import { CaleventEdit as HealthMaruyuWork } from "@addon/domains/health.maruyu.work/client";
import { CaleventEdit as PeopleMaruyuWork } from "@addon/domains/people.maruyu.work/client";
import { CaleventEdit as ProgressMaruyuWork } from "@addon/domains/progress.maruyu.work/client";
import { CaleventEdit as TimeMaruyuWork } from "@addon/domains/time.maruyu.work/client";
import { UpdateRefreshItemType } from "@client/contexts/EventsProvider";

export default function CaleventEditForm(props:{
  calevent: CaleventType,
  calendar: CalendarType,
  timezone: TimeZone,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,update:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
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