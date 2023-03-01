import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { GCalCalendar } from '../../../../mtypes/CalendarEvent';

export default function SideBar({
    calendarList, 
    getCalendarList,
    c_showSide, 
    c_showingCalendarIds, cset_showingCalendarIds
}){
  
  const [cookie, setCookie] = useCookies(['showButtons'])
  const { showButtons:c_showButtons } = cookie
  const cset_showButtons = (v:string) => setCookie('showButtons', v)
  if(c_showButtons===undefined) cset_showButtons(String(true))

  const [googleAuthUrl, setGoogleAuthUrl] = useState<string|null>(null);


  const showingCalendarIds:string[] = c_showingCalendarIds.split(',')
  const accessRoles = ['owner', 'writer', "reader", 'freeBusyReader'] as const
  const calendarListDivided:Record<string,Array<GCalCalendar>> = calendarList.reduce(
    (po,v)=>{po[v['accessRole']].push(v); return po},
    Object.assign({}, ...accessRoles.map(r=>({[r]:new Array<GCalCalendar>()})))
  )

  function grant_calendar(){
    fetch('/api/googlecalendar/grant').then(res=>res.json()).then(res=>{console.log(res);setGoogleAuthUrl(res.url)})
  }
  function disconnect_calendar(){
    fetch('/api/googlecalendar/disconnect').then(res=>res.json()).then(res=>{console.log(res)})
  }
  function refresh_calendar(){
    fetch('/api/googlecalendar/refreshCalendarList').then(res=>res.json()).then(res=>{getCalendarList();console.log(res)})
  }

  return (
    <div id="side" className="border-end m-1" style={{
        visibility:(c_showSide==="true")?"visible":"collapse",
        width:!(c_showSide==="true")?"0px":window.outerWidth>400?"200px":`${window.outerWidth}px`,
        height:"100%",
        overflow: "auto"
    }}>
      <div className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch"
               defaultChecked={c_showButtons==="true"}
               onChange={e=>cset_showButtons(String(e.target.checked))}
        />
        <label className="form-check-label">ボタンを表示</label>
      </div>
      <div style={{
        visibility:c_showButtons==="true"?"visible":"collapse",
        height:!(c_showButtons==="true")?"0px":"",
      }}>
        { 
          // calendarList === null &&
          <button type="button" className="btn btn-small btn-warning w-100" onClick={grant_calendar}>
            <p className="my-0">Grant Google Connection</p>
          </button>
        }
        { 
          // googleAuthUrl &&
          <button type="button" className="btn btn-small btn-danger w-100">
            <a href={String(googleAuthUrl)}><p className="my-0">Click Here to Grant</p></a>
          </button>
        }
        { 
          // calendarList === null && googleAuthUrl && 
          <button type="button" className="btn btn-small btn-info w-100" onClick={disconnect_calendar}>
            <p className="my-0">Disconnect</p>
          </button>
        }
        <button type="button" className="btn btn-small btn-info w-100" onClick={refresh_calendar}>
          <p className="my-0">Refresh Calendar</p>
        </button>
      </div>
      { calendarList !== null && calendarList !== undefined && Object.entries(calendarListDivided).map(([role,cals],i)=>
        <div key={i}>
          <p className="display-6 mb-0 mt-2" style={{fontSize:"1.0em"}}>{role}</p>
          {cals.map((cal,j)=>(
            <div key={j}>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch"
                       defaultChecked={c_showingCalendarIds.split(",").includes(cal.id)}
                       onChange={e=>{
                        console.log(typeof e.target.checked, e.target.checked, showingCalendarIds.includes(cal.id), cal.id)
                        if(!e.target.checked && showingCalendarIds.includes(cal.id)){
                            showingCalendarIds.splice(showingCalendarIds.indexOf(cal.id), 1)
                            cset_showingCalendarIds(String(showingCalendarIds.join(",")))
                        }else if(e.target.checked && !showingCalendarIds.includes(cal.id)){
                            showingCalendarIds.push(cal.id)
                            cset_showingCalendarIds(String(showingCalendarIds.join(",")))
                        }
                      }}
                />
                <label className="form-check-label" style={{fontSize:"0.6em",wordBreak:"break-all"}}>{cal.summary}</label>
              </div>
            </div>
            ))
          }
        </div>
      )}
    </div>
  )
}