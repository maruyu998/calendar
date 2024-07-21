import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CaleventClientType } from 'mtypes/v2/Calevent';
import { SECOND, wait } from 'maruyu-webcommons/commons/utils/time';
import { getCaleventList } from '../data/calevent';
import { useSetting } from './SettingProvider';
import { convertClientCalevent } from '../utils/calevent';
import { useStatus } from './StatusProvider';
import { CalendarType } from 'mtypes/v2/Calendar';
import { MdateTz, TimeZone } from 'maruyu-webcommons/commons/utils/mdate';
import { useTop } from './TopProvider';

type CaleventGroup = {[dateString:string]:CaleventClientType[]}

type EventsType = {
  eventGroup: CaleventGroup,
  dayEventGroup: CaleventGroup,
  refreshCaleventByUpdate: (calevent:CaleventClientType)=>void,
  refreshCaleventByRemove: (calevent:CaleventClientType)=>void,
}

const EventsContext = createContext<EventsType|undefined>(undefined);

export function useEvents(){
  const context = useContext(EventsContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function EventsProvider({children}){
  const { addAlert } = useTop();
  const { 
    showCalIds,
    dayDuration, 
    startDate,
    timezone,
  } = useSetting();
  const { calendarList } = useStatus();
  const calendarListRef = useRef<CalendarType[]>(calendarList);
  useEffect(()=>{ calendarListRef.current = calendarList }, [calendarList]);
  const showCalIdsRef = useRef<string[]>([]);
  useEffect(()=>{ showCalIdsRef.current = showCalIds }, [showCalIds]);
  const dayDurationRef = useRef<number>(1);
  useEffect(()=>{ dayDurationRef.current = dayDuration }, [dayDuration]);
  const startDateRef = useRef<MdateTz>(new MdateTz(undefined, timezone).resetTime());
  useEffect(()=>{ startDateRef.current = startDate}, [startDate]);
  const timezoneRef = useRef<TimeZone>("Asia/Tokyo");
  useEffect(()=>{ timezoneRef.current = timezone }, [timezone]);
  
  type FetchingParamsType = {
    fetchStartAt: number,
    paramKey: string,
    isLoading: boolean,
    caleventList: CaleventClientType[]
  }

  const [ isFetching, setIsFetching ] = useState<boolean>(false);
  const [ caleventList, setCaleventList ] = useState<CaleventClientType[]>([]);
  const [ eventGroup, setEventGroup ] = useState<CaleventGroup>({});
  const [ dayEventGroup, setDayEventGroup ] = useState<CaleventGroup>({});

  const getGEvents = useMemo(()=>async function(){
    await wait(()=>calendarListRef.current.length>0, 500);
    await wait(()=>!isFetching, 100);
    setIsFetching(true);
    const caleventList = await getCaleventList({
      calendarIds: showCalIdsRef.current, 
      startMdate: startDateRef.current,
      endMdate: startDateRef.current.forkAdd(dayDurationRef.current,"date")
    }).then(caleventList=>(
      caleventList.map(calevent=>convertClientCalevent(calevent,timezoneRef.current,calendarListRef.current))
    ));
    setCaleventList(caleventList);
    setIsFetching(false);
  }, [showCalIds,startDate,dayDuration,timezone,calendarList]);
  useEffect(()=>{
    const eventGroup: CaleventGroup = {}
    for(let calevent of caleventList){
      for(
        let date = calevent.startMdate.resetTime();
        date.unix < calevent.endMdate.unix; 
        date = date.forkAdd(1,'date')
      ){
        const dateString:string = date.format("YYYY-MM-DD");
        if(eventGroup[dateString] === undefined) eventGroup[dateString] = [];
        eventGroup[dateString].push(calevent);
      }
    }
    const eventGroup_ = {}
    const dayEventGroup_ = {}
    for(let [dateString, caleventList] of Object.entries(eventGroup)){
      eventGroup_[dateString] = new Array<CaleventClientType>();
      dayEventGroup_[dateString] = new Array<CaleventClientType>();
      for(let calevent of caleventList) {
        (calevent.style.isAllDay ? dayEventGroup_ : eventGroup_)[dateString].push(calevent)
      }
    }
    setEventGroup(eventGroup_);
    setDayEventGroup(dayEventGroup_);
  }, [caleventList])

  useEffect(()=>{
    getGEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCalIds, startDate, dayDuration, timezone])

  useEffect(()=>{
    const intervalId = setInterval(()=>getGEvents(), 30*SECOND);
    return ()=>clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshCaleventByUpdate = useMemo(()=>function(calevent:CaleventClientType){
    setCaleventList([...caleventList.filter(ce=>ce.id!=calevent.id), calevent])
  }, [caleventList]);
  const refreshCaleventByRemove = useMemo(()=>function(calevent:CaleventClientType){
    setCaleventList([...caleventList.filter(ce=>ce.id!=calevent.id)])
  }, [caleventList]);

  return (
    <EventsContext.Provider
      value={{
        eventGroup,
        dayEventGroup,
        refreshCaleventByUpdate,
        refreshCaleventByRemove
      }}
    >{children}</EventsContext.Provider>
  )
}