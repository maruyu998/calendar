import React, { useState } from 'react';
import { useStateUrlSearchParamType } from 'maruyu-webcommons/react/reactUse';
import { getCalendarList } from '../../data/calendar';
import { 
  getGrantGoogleCalendarUrl, 
  disconnectGoogleCalendar,
  refreshGoogleCalendarList,
} from '../../utils/GoogleCalendar';
import { useSetting } from '../../contexts/SettingProvider';
import { useStatus } from '../../contexts/StatusProvider';

import SideChovenLeft from "../../assets/icons/tsxs/SideChovenLeft";
import SideChovenRight from "../../assets/icons/tsxs/SideChovenRight";

export default function SideBar(){
  
  const { 
    showSide, setShowSide,
    showCalIds, setShowCalIds 
  } = useSetting();
  const { calendarList, setCalendarList } = useStatus();

  const [ showButtons, setShowButtons ] = useStateUrlSearchParamType<boolean>("showButtons", false, v=>String(v), v=>v==="true");
  const [ googleAuthUrl, setGoogleAuthUrl ] = useState<string|null>(null);

  return (
    <div className="flex h-full">
      { showSide &&
        <div className="flex-row border-e border-gray-300 w-56 p-1 pt-16">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch"
                    defaultChecked={showButtons}
                    onChange={e=>setShowButtons(e.target.checked)}
            />
            <label className="form-check-label">ボタンを表示</label>
          </div>
          <div style={{
            visibility:showButtons?"visible":"collapse",
            height:!showButtons?"0px":"",
          }}>
            { 
              // calendarList === null &&
              <button type="button" className="btn btn-small btn-warning w-full" onClick={
                ()=>getGrantGoogleCalendarUrl().then(url=>setGoogleAuthUrl(url))
              }>
                <p className="my-0">Grant Google Connection</p>
              </button>
            }
            { 
              // googleAuthUrl &&
              <button type="button" className="btn btn-small btn-danger w-full">
                <a href={String(googleAuthUrl)}><p className="my-0">Click Here to Grant</p></a>
              </button>
            }
            { 
              // calendarList === null && googleAuthUrl && 
              <button type="button" className="btn btn-small btn-info w-full" onClick={disconnectGoogleCalendar}>
                <p className="my-0">Disconnect</p>
              </button>
            }
            <button type="button" className="btn btn-small btn-info w-full" onClick={
              ()=>refreshGoogleCalendarList().then(()=>getCalendarList()).then(cals=>setCalendarList(cals))
            }>
              <p className="my-0">Refresh Calendar</p>
            </button>
          </div>
          { calendarList !== null && calendarList !== undefined && 
            calendarList.map(calendar=>(
              <div key={calendar.id}>
                <label className="inline-flex items-center mb-0.5 cursor-pointer">
                  <input type="checkbox" 
                    className="sr-only peer invisible"
                    defaultChecked={showCalIds.includes(calendar.id)}
                    onChange={e=>{
                      if(!e.target.checked && showCalIds.includes(calendar.id)){
                        showCalIds.splice(showCalIds.indexOf(calendar.id), 1)
                        setShowCalIds([...showCalIds])
                      }else if(e.target.checked && !showCalIds.includes(calendar.id)){
                        showCalIds.push(calendar.id)
                        setShowCalIds([...showCalIds])
                      }
                    }}
                  />
                  <div className="
                    relative w-9 h-5 bg-gray-200 
                    rounded-full peer 
                    peer-checked:after:translate-x-full 
                    rtl:peer-checked:after:-translate-x-full 
                    peer-checked:after:border-white 
                    after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white 
                    after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all 
                    peer-checked:bg-blue-600
                  "></div>
                  <span className="ms-3 text-xs font-medium text-gray-900">{calendar.name}</span>
                </label>
              </div>
            )
          )}
        </div>
      }
      <div className="my-3 absolute">
        <div className="text-gray-300 h-6 w-6 mx-auto cursor-pointer"
          onClick={()=>setShowSide(!showSide)}
        >
          { showSide ? <SideChovenLeft/> : <SideChovenRight/> }
        </div>
      </div>
    </div>
  );
}