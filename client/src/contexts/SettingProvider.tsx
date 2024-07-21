import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useCookie, useStateSession, useStateUrlSearchParamType, useTypeStateCookie } from "maruyu-webcommons/react/reactUse";
import { CalendarIdType } from 'mtypes/v2/Calendar';
import { MdateTz, TimeZone } from 'maruyu-webcommons/commons/utils/mdate';
import { useTop } from './TopProvider';

function isUUIDv4(uuid: string): boolean {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(uuid);
}

type SettingType = {
  showTop: boolean,
  showSide: boolean,
  dayDuration: number,
  heightScale: number,
  timezone: TimeZone,
  showCalIds: CalendarIdType[],
  startDate: MdateTz,
  setShowTop: React.Dispatch<React.SetStateAction<boolean>>,
  setShowSide: React.Dispatch<React.SetStateAction<boolean>>,
  setDayDuration: React.Dispatch<React.SetStateAction<number>>,
  setHeightScale: React.Dispatch<React.SetStateAction<number>>,
  setTimezone: React.Dispatch<React.SetStateAction<TimeZone>>,
  setShowCalIds: React.Dispatch<React.SetStateAction<CalendarIdType[]>>,
  setStartDate: React.Dispatch<React.SetStateAction<MdateTz>>
}

const SettingContext = createContext<SettingType|undefined>(undefined);

export function useSetting(){
  const context = useContext(SettingContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function SettingProvider({children}){

  const { deviceGenre } = useTop();

  const [ showTop, setShowTop ] = useStateUrlSearchParamType<boolean>(
    'showTop', false, 
    (v:boolean)=>String(v), (v:string)=>v==="true"
  );
  
  const [ showSide, setShowSide ] = useStateUrlSearchParamType<boolean>(
    'showSide', false, 
    (v:boolean)=>String(v), (v:string)=>v==="true"
  );
  
  const [ dayDuration, setDayDuration ] = useStateUrlSearchParamType<number>(
    'dayDuration', 7, 
    (v:number)=>String(v), (v:string)=>Number(v)
  );
  
  const [ heightScale, setHeightScale ] = useStateUrlSearchParamType<number>(
    'heightScale', 100, 
    (v:number)=>String(v), (v:string)=>Number(v)
  );

  const [ timezone, setTimezone ] = useStateUrlSearchParamType<TimeZone>(
    'timezone', "Asia/Tokyo", 
    (v:TimeZone)=>String(v), (v:string)=>(v as TimeZone)
  );

  const [ showCalIds, setShowCalIds ] = useStateUrlSearchParamType<CalendarIdType[]>(
    'showingCalendarIds', new Array<CalendarIdType>(), 
    (v:CalendarIdType[])=>v.join(","), 
    (v:string)=>v.split(",").filter(isUUIDv4) as Array<CalendarIdType>
  );
  const [ showCalIdsCache, setShowCalIdsCache ] = useTypeStateCookie<CalendarIdType[]>(
    'showingCalendarIds', new Array<CalendarIdType>(),
    (v:CalendarIdType[])=>v.join(","), 
    (v:string)=>v.split(",").filter(isUUIDv4) as Array<CalendarIdType>
  );
  const showCalIdsWrap = useMemo<CalendarIdType[]>(()=>{
    if(deviceGenre == "pc") return showCalIds;
    if(deviceGenre == "smartphone") return showCalIdsCache;
    return [];
  }, [deviceGenre, showCalIds, showCalIdsCache])
  const setShowCalIdsWrap = useMemo(()=>{
    if(deviceGenre == "pc") return setShowCalIds;
    return setShowCalIdsCache;
  }, [deviceGenre])

  const [ startDate, setStartDate ] = useStateSession<MdateTz>(
    'startDate', new MdateTz(undefined, timezone).resetTime().forkAdd(-1,'date'), 
    (mdate:MdateTz)=>mdate.unix, unix=>new MdateTz(unix, timezone)
  )

  return (
    <SettingContext.Provider
      value={{
        showTop,
        showSide, 
        dayDuration, 
        heightScale,
        timezone,
        showCalIds: showCalIdsWrap,
        startDate,
        setShowTop,
        setShowSide,
        setDayDuration,
        setHeightScale,
        setTimezone,
        setShowCalIds: setShowCalIdsWrap,
        setStartDate
      }}
    >{children}</SettingContext.Provider>
  )
}