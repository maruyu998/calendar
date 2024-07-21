import React, { useMemo } from 'react';
import TimeScale from './styles/TimeScale';
import { useCurtainLayout } from '../../contexts/CurtainLayoutProvider';
import { useSetting } from '../../contexts/SettingProvider';
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
  
  const { dayDuration, startDate } = useSetting();
  const { widths, minWidths } = useCurtainLayout();

  const dateObject = useMemo(()=>{
    return [...range(dayDuration)].map(i=>{
      const date = startDate.setLocale("en").forkAdd(i,'date');
      const dateString = date.format("YYYY-MM-DD");
      const width = widths[dateString];
      const minWidth = minWidths[dateString];
      return { date, dateString, width, minWidth }
    });
  }, [startDate, dayDuration, widths]);

  return (
    <div className="flex flex-col">
      <div ref={dayTopElm} 
        className="flex" 
        style={{marginLeft:`${calendarLeft}px`, width:`${calendarWidth}px`}}
      >
        {
          dateObject.map(({dateString,width,date})=>(
            <div 
              key={dateString} 
              className="px-0"
              style={{minWidth:`${width}px`}}
            >
              <DayCurtainTop date={date}/>
            </div>
          ))
        }
      </div>
      <div ref={dayEventElm} className="flex" style={{marginLeft:`${calendarLeft}px`, width:`${calendarWidth}px`}}>
        {
          dateObject.map(({dateString,width,date})=>(
            <div 
              key={dateString} 
              className="px-0 border-b border-e border-gray-200"
              style={{minWidth:`${width}px`}}
            >
              <DayEventCurtain date={date}/>
            </div>
          ))
        }
      </div>
      <div className="mx-0 no-scrollbar" style={{width:"100%", height:`${calendarHeight}px`, overflow:"auto"}}>
        <div className="flex flex-row" style={{height:`${curtainVirtualHeight}px`}}>
          <div ref={timeScaleElm} className="p-0">
            <TimeScale/>
          </div>
          <div ref={calendarElm} className="mx-0 relative" style={{width:`${calendarWidth}px`}}>
            <EventDraggingCardWrapper/>
            <div className="flex flex-row px-0 relative" style={{height:"100%"}}>
              {dateObject.map(({dateString,minWidth,date})=>(
                <div className="grow" key={dateString} style={{
                  minWidth:`${minWidth}px`,
                  height:"100%"
                }}>
                  <DayCurtain dateMdate={date}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}