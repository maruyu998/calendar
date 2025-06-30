import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useStateRef } from 'maruyu-webcommons/react/reactUse';
import { MdateTz } from 'maruyu-webcommons/commons/utils/mdate';
import { CaleventType } from '@client/types/calevent';
import { useTop } from './TopProvider';
import { useCurtainLayout } from './CurtainLayoutProvider';
import { useSetting } from './SettingProvider';
import { DAY, MINUTE } from 'maruyu-webcommons/commons/utils/time';

export type MouseCoordType = { x:number, y:number }
const ProcesssStates = ["default","top","bottom","updating"] as const
export type ProcessStateType = typeof ProcesssStates[number];
type DateRangeType = { start:MdateTz, end:MdateTz }
type DraggingStatusType = {
  state: "top"|"bottom"|"updating",
  calevent: CaleventType,
  startMouseCoord: MouseCoordType
}

type DraggingType = {
  setDraggingStatus: (v:DraggingStatusType|null)=>void,
  draggingStatusRef: React.MutableRefObject<DraggingStatusType|null>,
  setMouseCoord: (v:MouseCoordType|null)=>void,
  mouseCoordRef: React.MutableRefObject<MouseCoordType|null>,
  setDraggingDateRange: (v:DateRangeType|null)=>void,
  draggingDateRangeRef: React.MutableRefObject<DateRangeType|null>
}

const DraggingContext = createContext<DraggingType|undefined>(undefined);

export function useDragging(){
  const context = useContext(DraggingContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function DraggingProvider({children}: {children: React.ReactNode}){
  const { pressedKeys } = useTop();
  const { timezone, dayDuration, startMdate } = useSetting();
  const { widths, curtainVirtualHeight } = useCurtainLayout();

  const [ , setDraggingStatus, draggingStatusRef ] = useStateRef<DraggingStatusType|null>(null);
  const [ , setMouseCoord, mouseCoordRef ] = useStateRef<MouseCoordType|null>(null);
  const [ , setDraggingDateRange, draggingDateRangeRef ] = useStateRef<DateRangeType|null>(null);
  useEffect(()=>{
    if(pressedKeys.esc) {
      setDraggingStatus(null);
    }
  }, [pressedKeys])
  useEffect(()=>{
    if(draggingDateRangeRef.current == null) {
      setDraggingStatus(null);
      setMouseCoord(null);
      setDraggingDateRange(null);
    }
  }, [draggingDateRangeRef.current])

  const getMdate = useMemo(()=>{
    const widthCur = new Array<{num:number,mdate:MdateTz}>();
    let num = 0;
    for(let [key,value] of Object.entries(widths)){
      const mdate = MdateTz.parseFormat(key,"YYYY-MM-DD",timezone);
      num += value;
      widthCur.push({num, mdate});
    }
    const getMdateFromPointX = (x:number)=>{
      if(x < 0) return startMdate.forkAdd(-1,"date");
      for(const {num,mdate} of widthCur){
        if(num > x) return mdate;
      }
      return startMdate.forkAdd(dayDuration,"date");
    }
    return getMdateFromPointX;
  }, [widths, timezone, startMdate, dayDuration])

  useEffect(()=>{
    if(draggingStatusRef.current == null) return;
    if(mouseCoordRef.current == null) return;
    const processState = draggingStatusRef.current.state;
    const mouseCoord = mouseCoordRef.current;
    const startMouseCoord = draggingStatusRef.current.startMouseCoord;
    const calevent = draggingStatusRef.current.calevent;

    const addDates = (getMdate(mouseCoord.x).unix - getMdate(startMouseCoord.x).unix) / DAY;
    const moveY = mouseCoord.y - startMouseCoord.y;
    const addMinutes = Math.ceil((moveY/curtainVirtualHeight)*24*60/15)*15;
    const ms = addMinutes * MINUTE + addDates * DAY;
    if(processState=="top"){
      setDraggingDateRange({
        start: calevent.startMdate.addMs(ms),
        end: calevent.endMdate.addMs(ms)
      })
    }
    if(processState=="bottom"){
      const endMdate = new MdateTz(
        Math.max(calevent.startMdate.unix + 15*MINUTE, calevent.endMdate.unix + ms),
        timezone
      );
      setDraggingDateRange({
        start: calevent.startMdate,
        end: endMdate
      })
    }
  }, [ draggingStatusRef.current, mouseCoordRef.current ])

  return (
    <DraggingContext.Provider
      value={{
        setDraggingStatus,
        draggingStatusRef,
        setMouseCoord,
        mouseCoordRef,
        setDraggingDateRange,
        draggingDateRangeRef
      }}
    >{children}</DraggingContext.Provider>
  )
}