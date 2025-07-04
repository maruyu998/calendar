import { useMemo } from 'react';
import { MdateTz, TimeZone } from '@ymwc/mdate';
import { DOMAIN } from '../../const';
import { CalendarType } from "@client/types/calendar";
import { CaleventType } from "@client/types/calevent";
import { useToast } from '@ymwc/react-core';
import { HealthCalendarType, HealthCalendarSchema } from "../types/calendar";

export default function CaleventNew({
  clickedDate,
  timezone,
  calendar,
  refreshCaleventByCreate,
  closeModal,
}:{
  clickedDate: MdateTz,
  timezone: TimeZone,
  calendar: CalendarType,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();

  const healthCalendar = useMemo<HealthCalendarType|null>(()=>{
    const { success, error, data: healthCalendar } = HealthCalendarSchema.safeParse(calendar);
    if(!success) {
      console.error("Validation failed:");
      console.dir(error.format(), {depth:null});
      addToast("CalendarLoadFailed", error.message, "error");
      return null;
    }
    return healthCalendar;
  }, [ calendar ]);

  if(healthCalendar == null) return <></>;
  return (
    <p>Health Calendar is not allowed to create something new.</p>
  )
}