import { useEffect, useMemo, useRef, useState } from 'react';
import Linkify from 'react-linkify';
import { fetchFitbitSleepLogItem } from '../data/fitbitSleepLog';
import { TimeZone } from 'maruyu-webcommons/commons/utils/mdate';
import { useToast } from 'maruyu-webcommons/react/toast';
import { HealthCalendarSchema, HealthCalendarType } from '../types/calendar';
import { FitbitSleepLogType } from '../types/fitbitSleepLog';
import { CalendarType } from '@client/types/calendar';
import { CaleventIdType, CaleventType } from '@client/types/calevent';
import { convertFetchItemResponseToClient } from "../types/fitbitSleepLog";
import { FitbitSleepLogIdType } from '../../share/types/fitbitSleepLog';
import CaleventCommonView from '@addon/client/components/CaleventCommonView';
import { createDurationText, createTimeRangeText } from '../../../../client/utils/duration';
import { UpdateRefreshItemType } from '@client/contexts/EventsProvider';

function SleepLogEdit({
  caleventId,
  healthCalendar,
  timezone,
  fitbitSleepLog,
  refreshCaleventByUpdate,
  refreshCaleventByRemove,
  closeModal,
}:{
  caleventId: CaleventIdType,
  healthCalendar: HealthCalendarType,
  timezone: TimeZone,
  fitbitSleepLog: FitbitSleepLogType,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,update:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
  closeModal: ()=>void,
}){

  const { addToast } = useToast();
  const durationText = useMemo(()=>createDurationText(fitbitSleepLog.startMdate, fitbitSleepLog.endMdate), [fitbitSleepLog, timezone]);
  const timeRangeText = useMemo(()=>createTimeRangeText(fitbitSleepLog.startMdate, fitbitSleepLog.endMdate), [fitbitSleepLog, timezone]);

  return (
    <div>
      <div>
        <p className="block mb-1 text-md font-medium text-gray-900">{fitbitSleepLog.title}</p>
        <p className="block text-sm font-medium text-gray-900">{healthCalendar.name}</p>
        <p className="flex gap-1 text-sm font-normal text-gray-900">{timeRangeText}</p>
        <p className="block text-sm font-normal text-gray-900">{durationText}</p>
      </div>
      <div>
        <hr className="h-px my-4 bg-gray-200 border-0"/>
        <label className="block mb-1 text-sm font-medium text-gray-900">Description</label>
        <Linkify 
          componentDecorator={(decoratedHref, decoratedText, key)=>(
            <a target="blank" href={decoratedHref} key={key}
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >{decoratedText}</a>
          )}
        >
          <p className="block text-sm font-normal text-gray-900 whitespace-pre-wrap">{fitbitSleepLog.description}</p>
        </Linkify>
        <hr className="h-px my-4 bg-gray-200 border-0"/>
      </div>
    </div>
  )
}

export default function CaleventEdit({
  calevent,
  calendar,
  timezone,
  refreshCaleventByUpdate,
  refreshCaleventByRemove,
  closeModal,
}:{
  calevent: CaleventType,
  calendar: CalendarType,
  timezone: TimeZone,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,update:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();
  const [ fitbitSleepLog, setFitbitSleepLog ] = useState<FitbitSleepLogType|null>(null);
  useEffect(()=>{
    fetchFitbitSleepLogItem({ calendarId: calendar.id, id: calevent.id as unknown as FitbitSleepLogIdType })
    .then(responseObject=>convertFetchItemResponseToClient(responseObject, timezone))
    .then(fitbitSleepLog=>{
      setFitbitSleepLog(fitbitSleepLog);
    })
    .catch(error=>{
      addToast("FetchActivityFailed", error.message, "error");
    })
  }, [calevent])

  const healthCalendar = useMemo<HealthCalendarType|null>(()=>{
    const { success, error, data: healthCalendar } = HealthCalendarSchema.safeParse(calendar);
    if(!success) {
      console.error("Validation failed:");
      console.dir(error.format(), {depth:null});
      addToast("FetchGcalEventFailed", error.message, "error");
      return null;
    }
    return healthCalendar;
  }, [ calendar ]);
  
  if(healthCalendar == null || fitbitSleepLog == null) return (
    <CaleventCommonView calevent={calevent} calendar={calendar} timezone={timezone} loading={true}/>
  );
  return (
    <SleepLogEdit 
      caleventId={calevent.id}
      healthCalendar={healthCalendar}
      timezone={timezone}
      fitbitSleepLog={fitbitSleepLog} 
      refreshCaleventByUpdate={refreshCaleventByUpdate}
      refreshCaleventByRemove={refreshCaleventByRemove}
      closeModal={closeModal}
    />
  );
}