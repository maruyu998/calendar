import React, { useEffect, useState, useRef } from 'react';
import Datepicker from "react-tailwindcss-datepicker";
import { MdateTz, TIME_ZONES, TimeZone } from 'maruyu-webcommons/commons/utils/mdate';
import { useSetting } from '@client/contexts/SettingProvider';
import TopChovenDown from "../../../assets/icons/tsxs/TopChovenDown";
import TopChovenUp from "../../../assets/icons/tsxs/TopChovenUp";
import LeftChoven from '../../../assets/icons/tsxs/LeftChoven';
import LeftDoubleChoven from '../../../assets/icons/tsxs/LeftDoubleChoven';
import RightChoven from '../../../assets/icons/tsxs/RightChoven';
import RightDoubleChoven from '../../../assets/icons/tsxs/RightDoubleChoven';
import TodayIcon from '../../../assets/icons/tsxs/TodayIcon';

export default function TopBar(){
  const {
    showTop, setShowTop,
    dayDuration, setDayDuration,
    heightScale, setHeightScale,
    timezone, setTimezone,
    startMdate, setStartMdate
  } = useSetting();

  const [isHovering, setIsHovering] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse proximity detection for toggle button visibility
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseY = e.clientY;
      const proximity = 60; // Show toggle when within 60px of top
      const isNearTop = mouseY <= proximity;

      setIsHovering(isNearTop);
    };

    // Add event listener
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle manual show/hide button clicks
  const handleToggle = () => {
    setShowTop(!showTop);
  };

  return (
    <>
      {showTop ? (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-3 py-1.5 gap-3">
            {/* Navigation Controls */}
            <div className="flex items-center gap-0.5">
              <div className="flex items-center bg-gray-50 rounded-md p-0.5">
                <button 
                  className="p-1 rounded hover:bg-gray-200 transition-colors hidden sm:block w-6 h-6" 
                  onClick={()=>setStartMdate(startMdate.forkAdd(-dayDuration,"date"))}
                  title={`Go back ${dayDuration} day${dayDuration > 1 ? 's' : ''}`}
                >
                  <LeftDoubleChoven/>
                </button>
                <button 
                  className="p-1 rounded hover:bg-gray-200 transition-colors hidden sm:block w-6 h-6" 
                  onClick={()=>setStartMdate(startMdate.forkAdd(-1,"date"))}
                  title="Previous day"
                >
                  <LeftChoven/>
                </button>
                <button 
                  className="p-1 rounded hover:bg-blue-100 text-blue-600 transition-colors hidden sm:block w-6 h-6" 
                  onClick={()=>setStartMdate(new MdateTz(undefined, timezone).resetTime())}
                  title="Go to today"
                >
                  <TodayIcon/>
                </button>
                <button 
                  className="p-1 rounded hover:bg-gray-200 transition-colors hidden sm:block w-6 h-6" 
                  onClick={()=>setStartMdate(startMdate.forkAdd(1,"date"))}
                  title="Next day"
                >
                  <RightChoven/>
                </button>
                <button 
                  className="p-1 rounded hover:bg-gray-200 transition-colors hidden sm:block w-6 h-6" 
                  onClick={()=>setStartMdate(startMdate.forkAdd(dayDuration,"date"))}
                  title={`Go forward ${dayDuration} day${dayDuration > 1 ? 's' : ''}`}
                >
                  <RightDoubleChoven/>
                </button>
              </div>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                  </svg>
                </div>
                <input 
                  type="date" 
                  className="
                    pl-7 pr-2 py-1 border border-gray-300 rounded text-xs
                    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 
                    bg-white hover:border-gray-400 transition-colors h-7
                  " 
                  value={startMdate.format("YYYY-MM-DD")}
                  onChange={e=>setStartMdate(MdateTz.parseFormat(e.target.value,"YYYY-MM-DD",timezone))}
                />
              </div>

              {/* Days Duration */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600 hidden sm:block">Show</span>
                <input 
                  type="number" 
                  defaultValue={dayDuration}
                  min={1}
                  max={30}
                  onChange={e=>setDayDuration(Number(e.target.value))}
                  className="
                    w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center
                    focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                    bg-white hover:border-gray-400 transition-colors h-7
                  "
                />
                <span className="text-xs text-gray-600 hidden sm:block">days</span>
              </div>
            </div>

            {/* Height Scale Slider */}
            <div className="flex items-center gap-1 hidden sm:flex">
              <span className="text-xs text-gray-600 whitespace-nowrap">Scale</span>
              <input 
                type="range" 
                className="
                  w-16 h-1 bg-gray-200 rounded appearance-none cursor-pointer
                  range-slider
                " 
                min="0" 
                max="300" 
                defaultValue={heightScale}
                onChange={e=>setHeightScale(Number(e.target.value))}
                onDoubleClick={e=>{setHeightScale(100);e.currentTarget.value="100"}}
              />
              <span className="text-xs text-gray-500 w-6 text-center">{heightScale}%</span>
            </div>

          </div>
        </div>
      ) : null}
      
      {/* Floating Toggle Button - Shows on mouse proximity to top */}
      <div className={`w-full absolute z-10 transition-opacity duration-500 ${
        isHovering ? 'opacity-60' : 'opacity-0'
      }`}>
        <div 
          className="text-gray-400 h-5 w-5 mx-auto cursor-pointer hover:text-gray-600 transition-colors"
          onClick={handleToggle}
          title={showTop ? "Hide toolbar" : "Show toolbar"}
        >
          {showTop ? <TopChovenUp/> : <TopChovenDown/>}
        </div>
      </div>
    </>
  )
}