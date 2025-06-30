import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SECOND, wait } from 'maruyu-webcommons/commons/utils/time';
import { fetchCaleventList } from '@client/data/calevent';
import { useSetting } from './SettingProvider';
import { useStatus } from './StatusProvider';
import { MdateTz, TimeZone } from 'maruyu-webcommons/commons/utils/mdate';
import { useToast } from 'maruyu-webcommons/react/toast';
import { CalendarIdType, CalendarType } from '@client/types/calendar';
import {
  CaleventIdType,
  CaleventType,
  convertFetchListResponseToClient as convertFetchCaleventListResponseToClient,
} from "@client/types/calevent";

type CaleventGroup = {[dateString:string]:CaleventType[]}
export type UpdateRefreshItemType = Partial<Pick<CaleventType,"title"|"startMdate"|"endMdate"|"style">>
type EventsType = {
  eventGroup:CaleventGroup,
  dayEventGroup:CaleventGroup,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,updateItem:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
}

const EventsContext = createContext<EventsType|undefined>(undefined);

export function useEvents(){
  const context = useContext(EventsContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function EventsProvider({children}: {children: React.ReactNode}){
  const { addToast } = useToast();
  const {
    showCalIds,
    dayDuration,
    startMdate,
    timezone,
  } = useSetting();
  const { calendarList } = useStatus();
  const calendarListRef = useRef<CalendarType[]>(calendarList);
  useEffect(()=>{ calendarListRef.current = calendarList }, [calendarList]);
  const showCalIdListRef = useRef<CalendarIdType[]>([]);
  useEffect(()=>{ showCalIdListRef.current = showCalIds }, [showCalIds]);
  const dayDurationRef = useRef<number>(1);
  useEffect(()=>{ dayDurationRef.current = dayDuration }, [dayDuration]);
  const startMdateRef = useRef<MdateTz>(new MdateTz(undefined, timezone).resetTime());
  useEffect(()=>{ startMdateRef.current = startMdate}, [startMdate]);
  const timezoneRef = useRef<TimeZone>("Asia/Tokyo");
  useEffect(()=>{ timezoneRef.current = timezone }, [timezone]);

  type FetchingParamsType = {
    fetchStartAt: number,
    paramKey: string,
    isLoading: boolean,
    caleventList: CaleventType[]
  }

  const [ isFetching, setIsFetching ] = useState<boolean>(false);
  const [ caleventList, setCaleventList ] = useState<CaleventType[]>([]);
  const [ eventGroup, setEventGroup ] = useState<CaleventGroup>({});
  const [ dayEventGroup, setDayEventGroup ] = useState<CaleventGroup>({});

  const fetchGEvents = useMemo(()=>async function(){
    await wait(()=>calendarListRef.current.length > 0, 500);
    await wait(()=>!isFetching, 100);
    setIsFetching(true);
    await fetchCaleventList({
      calendarIdList: showCalIdListRef.current,
      startTime: startMdateRef.current.toDate(),
      endTime: startMdateRef.current.forkAdd(dayDurationRef.current,"date").toDate()
    })
    .then(responseObject=>convertFetchCaleventListResponseToClient(responseObject, calendarListRef.current, timezone))
    .then(newCaleventList=>{
      const oldCaleventMap:{[caleventId:CaleventIdType]:CaleventType} = {}
      for(const oldCalevent of caleventList) oldCaleventMap[oldCalevent.id] = oldCalevent;
      setCaleventList(newCaleventList.map(calevent=>{
        const oldCalevent = oldCaleventMap[calevent.id];
        if(oldCalevent == undefined) return calevent;
        if(calevent.updatedAt.getTime() < oldCalevent.updatedAt.getTime()) return oldCalevent;
        return calevent;
      }))
    })
    .catch(error=>{
      if(error.name == "AuthenticationError"){
        setTimeout(()=>window.location.reload(), 15*SECOND);
      }
      addToast(`Fetching Error [${error.name}]`, error.message, "error");
      console.error(error);
    });
    setIsFetching(false);
  }, [showCalIds, startMdate, dayDuration, timezone, calendarList]);
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
    const eventGroup_: Record<string, CaleventType[]> = {}
    const dayEventGroup_: Record<string, CaleventType[]> = {}
    for(let [dateString, caleventList] of Object.entries(eventGroup)){
      eventGroup_[dateString] = new Array<CaleventType>();
      dayEventGroup_[dateString] = new Array<CaleventType>();
      for(let calevent of caleventList) {
        (calevent.style.isAllDay ? dayEventGroup_ : eventGroup_)[dateString].push(calevent)
      }
    }
    setEventGroup(eventGroup_);
    setDayEventGroup(dayEventGroup_);
  }, [caleventList])

  useEffect(()=>{
    fetchGEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCalIds, startMdate, dayDuration, timezone])

  useEffect(()=>{
    const intervalId = setInterval(()=>fetchGEvents(), 30*SECOND);
    return ()=>clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshCaleventByCreate = useMemo(()=>function(calevent:CaleventType){
    setCaleventList([...caleventList, calevent]);
  }, [caleventList])
  const refreshCaleventByUpdate = useMemo(()=>function(
    caleventId:CaleventIdType, 
    updateItem:UpdateRefreshItemType,
  ){
    setCaleventList([
      ...caleventList.map(ce=>ce.id!=caleventId ? ce : { ...ce, ...updateItem })
    ]);
  }, [caleventList]);
  const refreshCaleventByRemove = useMemo(()=>function(
    caleventId:CaleventIdType
  ){
    setCaleventList([
      ...caleventList.filter(ce=>ce.id!=caleventId)
    ])
  }, [caleventList]);

  return (
    <EventsContext.Provider
      value={{
        eventGroup,
        dayEventGroup,
        refreshCaleventByCreate,
        refreshCaleventByUpdate,
        refreshCaleventByRemove,
      }}
    >{children}</EventsContext.Provider>
  )
}