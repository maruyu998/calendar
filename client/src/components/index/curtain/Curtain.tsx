import React, { useMemo } from 'react';
import TimeScale from './styles/TimeScale';
import { useCurtainLayout } from '@client/contexts/CurtainLayoutProvider';
import { useSetting } from '@client/contexts/SettingProvider';
import { range } from 'maruyu-webcommons/commons/utils/number';
import DayCurtain from './DayCurtain';
import DayCurtainTop from './DayCurtainTop';
import DayEventCurtain from './DayEventCurtain';
import EventDraggingCardWrapper from './EventDraggingCard';

export default function Curtain(){
  const {
    timeScaleElm,
    dayTopElm,
    dayEventElm,
    calendarElm,
    calendarLeft,
    calendarWidth,
    calendarHeight,
    curtainVirtualHeight
  } = useCurtainLayout();
  
  const { dayDuration, startMdate } = useSetting();
  const { widths } = useCurtainLayout();

  const dateObject = useMemo(()=>{
    return [...range(dayDuration)].map(i=>{
      const dateMdate = startMdate.setLocale("en").forkAdd(i,'date');
      const dateString = dateMdate.format("YYYY-MM-DD");
      const width = widths[dateString];
      return { dateMdate, dateString, width }
    });
  }, [startMdate, dayDuration, widths]);

  return (
    <div className="flex flex-col">
      <div ref={dayTopElm} className="flex" style={{ marginLeft: `${calendarLeft}px`, width: `${calendarWidth}px` }}>
        {
          dateObject.map(({dateString,width,dateMdate})=>(
            <div key={dateString} className="px-0" style={{ width: `${width}px` }}>
              <DayCurtainTop dateMdate={dateMdate}/>
            </div>
          ))
        }
      </div>
      <div ref={dayEventElm} className="flex" style={{ marginLeft: `${calendarLeft}px`, width: `${calendarWidth}px` }}>
        {
          dateObject.map(({dateString,width,dateMdate})=>(
            <div key={dateString} className="px-0 border-b border-e border-gray-200" style={{ width: `${width}px` }}>
              <DayEventCurtain dateMdate={dateMdate}/>
            </div>
          ))
        }
      </div>
      <div className="mx-0 no-scrollbar w-full overflow-auto" style={{ height: `${calendarHeight}px` }}>
        <div className="flex flex-row" style={{ height: `${curtainVirtualHeight}px` }}>
          <div ref={timeScaleElm} className="p-0">
            <TimeScale/>
          </div>
          <div ref={calendarElm} className="mx-0 relative" style={{ width: `${calendarWidth}px` }}>
            <EventDraggingCardWrapper/>
            <div className="flex flex-row px-0 relative h-full">
              {dateObject.map(({dateString,width,dateMdate})=>(
                <div key={dateString} className="grow h-full" style={{ width: `${width}px` }}>
                  <DayCurtain dateMdate={dateMdate}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}