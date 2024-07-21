import React, { createContext, useContext, useEffect, useState } from 'react';
import { Mdate, MdateTz } from 'maruyu-webcommons/commons/utils/mdate';
import { useSetting } from './SettingProvider';
import { CalendarType } from 'mtypes/v2/Calendar';
import { getCalendarList } from '../data/calendar';
import { DAY, MINUTE } from 'maruyu-webcommons/commons/utils/time';

type StatusType = {
  calendarList: CalendarType[],
  today: MdateTz,
  currentTime: Mdate,
  setCalendarList: React.Dispatch<React.SetStateAction<CalendarType[]>>,
  setToday: React.Dispatch<React.SetStateAction<MdateTz>>,
}

const StatusContext = createContext<StatusType|undefined>(undefined);

export function useStatus(){
  const context = useContext(StatusContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function StatusProvider({children}){

  const { timezone } = useSetting();

  const [ calendarList, setCalendarList ] = useState<CalendarType[]>([]);
  const [ today, setToday ] = useState<MdateTz>(new MdateTz(undefined, timezone).resetTime());
  const [ currentTime, setCurrentTime ] = useState<Mdate>(Mdate.now());

  useEffect(()=>{
    let intervalId;
    setTimeout(()=>{
      intervalId = setInterval(()=>setToday(new MdateTz(undefined, timezone).resetTime()), DAY)},
      (DAY - (Mdate.now().unix - new MdateTz(undefined, timezone).resetTime().unix))
    )
    return ()=>clearInterval(intervalId);
  }, [timezone]);
  useEffect(()=>{
    let intervalId;
    setTimeout(()=>{
      intervalId = setInterval(()=>setCurrentTime(Mdate.now()), MINUTE)
    }, MINUTE - Mdate.now().unix % MINUTE)
    return ()=>clearInterval(intervalId);
  }, []);

  useEffect(()=>{getCalendarList().then(cl=>setCalendarList(cl))},[]);

  return (
    <StatusContext.Provider
      value={{
        calendarList, 
        today,
        currentTime,
        setCalendarList, 
        setToday,
      }}
    >{children}</StatusContext.Provider>
  )
}