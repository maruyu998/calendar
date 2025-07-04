import { useEffect, useMemo, useRef, useState } from 'react';
import Linkify from 'react-linkify';
import { DatafootCalendarType, DatafootCalendarSchema } from "../types/calendar";
import { DAY, HOUR, MINUTE } from '@ymwc/utils';
import { MdateTz, TimeZone } from '@ymwc/mdate';
import { useToast } from '@ymwc/react-core';
import { CaleventIdType, CaleventType } from "@client/types/calevent";
import { CalendarType } from "@client/types/calendar";
import { AndroidAppUsageType } from "../types/androidAppUsage";
import { fetchAndroidAppUsage } from "../data/androidAppUsage";
import { convertFetchItemResponseToClient } from "../types/androidAppUsage";
import { AndroidAppUsageIdType } from '../../share/types/androidAppUsage';
import CaleventCommonView from '@addon/client/components/CaleventCommonView';
import { createDurationText, createTimeRangeText } from '../../../../client/utils/duration';
import { UpdateRefreshItemType } from '@client/contexts/EventsProvider';

function AndroidAppUsageEdit({
  caleventId,
  datafootCalendar,
  timezone,
  androidAppUsage,
  refreshCaleventByUpdate,
  refreshCaleventByRemove,
  closeModal,
}:{
  caleventId: CaleventIdType,
  datafootCalendar: DatafootCalendarType,
  timezone: TimeZone,
  androidAppUsage: AndroidAppUsageType,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,update:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
  closeModal: ()=>void,
}){
  const durationText = useMemo(()=>createDurationText(androidAppUsage.startMdate, androidAppUsage.endMdate), [androidAppUsage, timezone]);
  const timeRangeText = useMemo(()=>createTimeRangeText(androidAppUsage.startMdate, androidAppUsage.endMdate), [androidAppUsage, timezone]);

  return (
    <div>
      <div>
        <p className="block mb-1 text-md font-medium text-gray-900">{androidAppUsage.appName}</p>
        <p className="block text-sm font-medium text-gray-900">{datafootCalendar.name}</p>
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
        <p className="block text-sm font-normal text-gray-900 whitespace-pre-wrap">appId: {androidAppUsage.appId}</p>
      </Linkify>
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
  const [ androidAppUsage, setAndroidAppUsage ] = useState<AndroidAppUsageType|null>(null);
  useEffect(()=>{
    fetchAndroidAppUsage({ calendarId: calendar.id, id: calevent.id as unknown as AndroidAppUsageIdType })
    .then(responseObject=>convertFetchItemResponseToClient(responseObject, timezone))
    .then(androidAppUsage=>{
      setAndroidAppUsage(androidAppUsage);
    })
    .catch(error=>{
      addToast("FetchAndroidAppUsageFailed", error.message, "error");
    })
  }, [calevent])

  const datafootCalendar = useMemo<DatafootCalendarType|null>(()=>{
    const { success, error, data: datafootCalendar } = DatafootCalendarSchema.safeParse(calendar);
    if(!success) {
      console.error("Validation failed:");
      console.dir(error.format(), {depth:null});
      addToast("CalendarSchema is not match", error.message, "error");
      return null;
    }
    return datafootCalendar;
  }, [ calendar ]);

  if(datafootCalendar == null || androidAppUsage == null) return (
    <CaleventCommonView calevent={calevent} calendar={calendar} timezone={timezone} loading={true}/>
  )
  return (
    <AndroidAppUsageEdit
      caleventId={calevent.id}
      datafootCalendar={datafootCalendar}
      timezone={timezone}
      androidAppUsage={androidAppUsage}
      refreshCaleventByUpdate={refreshCaleventByUpdate}
      refreshCaleventByRemove={refreshCaleventByRemove}
      closeModal={closeModal}
    />
  );
}