import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useStateUrlSearchParamType, useTypeStateCookie } from "maruyu-webcommons/react/reactUse";
import { CalendarIdType } from '@client/types/calendar';
import { MdateTz, TimeZone } from '@ymwc/mdate';
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
  startMdate: MdateTz,
  setShowTop: React.Dispatch<React.SetStateAction<boolean>>,
  setShowSide: React.Dispatch<React.SetStateAction<boolean>>,
  setDayDuration: React.Dispatch<React.SetStateAction<number>>,
  setHeightScale: React.Dispatch<React.SetStateAction<number>>,
  setTimezone: React.Dispatch<React.SetStateAction<TimeZone>>,
  setShowCalIds: React.Dispatch<React.SetStateAction<CalendarIdType[]>>,
  setStartMdate: React.Dispatch<React.SetStateAction<MdateTz>>,
  isSettingOpen: boolean,
  setIsSettingOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const SettingContext = createContext<SettingType|undefined>(undefined);

export function useSetting(){
  const context = useContext(SettingContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function SettingProvider({children}: {children: React.ReactNode}){

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

  const [ startMdate, setStartMdate ] = useTypeStateCookie<MdateTz>(
    'startMdate',
    new MdateTz(undefined, timezone).resetTime().forkAdd(-1,'date'),
    (mdate:MdateTz)=>String(mdate.unix),
    unixStr=>(
      Number.isNaN(Number(unixStr))
      ? new MdateTz(undefined, timezone).resetTime().forkAdd(-1,'date')
      : new MdateTz(Number(unixStr), timezone)
    )
  )

  const [ isSettingOpen, setIsSettingOpen ] = useState<boolean>(false);

  return (
    <SettingContext.Provider
      value={{
        showTop,
        showSide,
        dayDuration,
        heightScale,
        timezone,
        showCalIds: showCalIdsWrap,
        startMdate,
        setShowTop,
        setShowSide,
        setDayDuration,
        setHeightScale,
        setTimezone,
        setShowCalIds: setShowCalIdsWrap,
        setStartMdate,
        isSettingOpen,
        setIsSettingOpen,
      }}
    >{children}</SettingContext.Provider>
  )
}