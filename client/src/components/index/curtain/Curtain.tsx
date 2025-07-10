import React, { useMemo, useState, useEffect } from 'react';
import TimeScale from './styles/TimeScale';
import { useCurtainLayout } from '@client/contexts/CurtainLayoutProvider';
import { useSetting } from '@client/contexts/SettingProvider';
import { numberRange as range } from '@ymwc/utils';
import DayCurtain from './DayCurtain';
import DayCurtainTop from './DayCurtainTop';
import DayEventCurtain from './DayEventCurtain';
import EventDraggingCardWrapper from './EventDraggingCard';
import SideChovenRight from "@client/assets/icons/tsxs/SideChovenRight";

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
  
  const { dayDuration, startMdate, showSide, setShowSide } = useSetting();
  const { widths } = useCurtainLayout();

  const [isHovering, setIsHovering] = useState(false);

  // Mouse proximity detection for toggle button visibility
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const proximity = 60; // Show when within 60px of left
      const isNearLeft = mouseX <= proximity;
      
      setIsHovering(isNearLeft);
    };
    
    // Add event listener
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle sidebar toggle
  const handleToggle = () => {
    setShowSide(!showSide);
  };

  const dateObject = useMemo(()=>{
    return [...range(dayDuration)].map(i=>{
      const dateMdate = startMdate.setLocale("en").forkAdd(i,'date');
      const dateString = dateMdate.format("YYYY-MM-DD");
      const width = widths[dateString];
      return { dateMdate, dateString, width }
    });
  }, [startMdate, dayDuration, widths]);

  return (
    <div className="flex flex-col relative">
      {/* Sidebar Toggle Button - positioned above TimeScale */}
      {!showSide && (
        <div 
          className={`absolute left-0 z-50 transition-opacity duration-500 ${
            isHovering ? 'opacity-60' : 'opacity-0'
          }`}
          style={{ 
            top: `${(dayTopElm.current?.offsetHeight || 0) + (dayEventElm.current?.offsetHeight || 0) - 30}px`
          }}
        >
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleToggle}
            title="Show sidebar"
          >
            <div className="w-4 h-4">
              <SideChovenRight/>
            </div>
          </button>
        </div>
      )}

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