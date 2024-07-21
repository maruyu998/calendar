import React from 'react';
import Datepicker from "react-tailwindcss-datepicker";
import { MdateTz, TIME_ZONES, TimeZone } from 'maruyu-webcommons/commons/utils/mdate';
import { useSetting } from '../../contexts/SettingProvider';
import TopChovenDown from "../../assets/icons/tsxs/TopChovenDown";
import TopChovenUp from "../../assets/icons/tsxs/TopChovenUp";
import LeftChoven from '../../assets/icons/tsxs/LeftChoven';
import LeftDoubleChoven from '../../assets/icons/tsxs/LeftDoubleChoven';
import RightChoven from '../../assets/icons/tsxs/RightChoven';
import RightDoubleChoven from '../../assets/icons/tsxs/RightDoubleChoven';
import TodayIcon from '../../assets/icons/tsxs/TodayIcon';

export default function TopBar(){
  const { 
    showTop, setShowTop,
    dayDuration, setDayDuration,
    heightScale, setHeightScale,
    timezone, setTimezone,
    startDate, setStartDate
  } = useSetting();

  return (
    <>
      {
        showTop &&
        <div className="flex border-b border-gray-200 p-1">
          <button className="px-2 w-8 h-8 hidden sm:block" onClick={()=>setStartDate(startDate.forkAdd(-dayDuration,"date"))}><LeftDoubleChoven/></button>
          <button className="px-2 w-8 h-8 hidden sm:block" onClick={()=>setStartDate(startDate.forkAdd(-1,"date"))}><LeftChoven/></button>
          <button className="px-2 w-8 h-8 hidden sm:block" onClick={()=>setStartDate(startDate.forkAdd(1,"date"))}><RightChoven/></button>
          <button className="px-2 w-8 h-8 hidden sm:block" title="next" onClick={()=>setStartDate(startDate.forkAdd(dayDuration,"date"))}><RightDoubleChoven/></button>
          <button className="px-2 w-8 h-8 hidden sm:block" title="today" onClick={()=>setStartDate(new MdateTz(undefined, timezone).resetTime())}><TodayIcon/></button>
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
              <svg className="w-3 h-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
              </svg>
            </div>
            <input type="date" 
              className="
                bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full ps-7 p-1
              " 
              value={startDate.format("YYYY-MM-DD")}
              onChange={e=>setStartDate(MdateTz.parseFormat(e.target.value,"YYYY-MM-DD",timezone))}
            />
          </div>

          <div className="max-w-xs mx-1">
            <div className="relative flex items-center max-w-[5rem] rounded-lg border h-full">
              <input 
                type="number" 
                defaultValue={dayDuration}
                min={1}
                onChange={e=>setDayDuration(Number(e.target.value))}
                className="
                  bg-gray-50 border-x-0 border-gray-300 font-medium text-gray-900 text-base 
                  focus:ring-blue-500 focus:border-blue-500 block w-full ms-3 me-6
                "
              />
              <div className="items-center text-[0.5rem] text-gray-400 absolute right-1">Days</div>
            </div>
          </div>

          <div className="input-group hidden sm:block">
            <input type="range" className="form-range my-auto" min="0" max="300" id="HeightScale" 
                    defaultValue={heightScale}
                    onChange={e=>setHeightScale(Number(e.target.value))}
                    onDoubleClick={e=>{setHeightScale(100);e.currentTarget.value="100"}}
            />
          </div>
          {/* <div className="input-group" style={{maxWidth:"120px"}}>
            <select className="form-select" onChange={e=>setTimezone(e.target.value as TimeZone)}>
              {Object.keys(TIME_ZONES).map((tz,i)=>(
                <option key={i} value={tz} defaultChecked={tz===timezone}>{tz}</option>
              ))}
            </select>
          </div> */}
        </div>
      }
      <div className="w-full absolute">
        <div className="text-gray-300 h-5 w-5 mx-auto cursor-pointer"
          onClick={()=>setShowTop(!showTop)}
        >
          { showTop ? <TopChovenUp/> : <TopChovenDown/> }
        </div>
      </div>
    </>
  )
}