import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Popup from 'reactjs-popup';
import DayCurtain from '../components/curtain/DayCurtain';
import * as dateUtil from '../../mutils/date';
import { range } from '../../mutils/number';
import { CalendarEventGroup } from '../../mtypes/CalendarEvent';

export default function Home() {

  const [cookie, setCookie] = useCookies(['showDateCount'])
  if(!cookie.showDateCount) setCookie('showDateCount', 7)

  const [eventGroup, setEventGroup] = useState<CalendarEventGroup>({});
  const [showSide, setShowSide] = useState<Boolean>(false);
  const [startDate, setStartDate] = useState<Date>(dateUtil.yesterday(dateUtil.getTimeReset(new Date())));

  useEffect(()=>{
    fetch('/api/events?group=date').then(res=>res.json()).then(res=>{
      setEventGroup(res.eventGroup)
    })
  }, [])

  const [popup, setPopup] = useState<string|null>(null);
  const [googleAuthUrl, setGoogleAuthUrl] = useState<string|null>(null);

  useEffect(()=>{
    setPopup((new URL(window.location.href)).searchParams.get('popup'))
  }, [])

  return (
    <div>
      <Popup open={popup==="show_credential"}>
        <div className="p-5 bg-white shadow-lg">
          <h1>Google Calendar Credentials</h1>
          <p>pick the credential data from GCP console</p>
          <form name="show_credential" onSubmit={e=>{
              e.preventDefault();
              fetch("/api/googlecalendar/register", {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                  client_id: (document.getElementById('client_id') as HTMLInputElement)?.value,
                  client_secret: (document.getElementById('client_secret') as HTMLInputElement)?.value,
                  redirect_uri: (document.getElementById('redirect_uri') as HTMLInputElement)?.value
                })
              }).then(res=>res.json()).then(res=>{
                console.log(res)
                // window.location = "/"
              })
            }}>
            <div className="mb-3">
              <label htmlFor="client_id" className="form-level">client_id</label>
              <input type="text" id="client_id" className="form-control"/>
            </div>
            <div className="mb-3">
              <label htmlFor="client_secret" className="form-level">client_secret</label>
              <input type="text" id="client_secret" className="form-control"/>
            </div>
            <div className="mb-3">
              <label htmlFor="redirect_uri" className="form-level">redirect_uri</label>
              <input type="text" id="redirect_uri" className="form-control"/>
            </div>
            <button className="btn btn-primary" type="submit">Submit</button>
          </form>
        </div>
      </Popup>
      <div id="header">
        <div className="d-flex">
          <button type="button" className="btn btn-light"
                  onClick={()=>setShowSide(!showSide)}>
            <i className={!showSide?"bi bi-list":"bi bi-x-lg"}></i>
          </button>
          <button type="button" className="btn btn-light"
                  onClick={()=>setStartDate(dateUtil.add(startDate,-Number(cookie.showDateCount),"day"))}>
            <i className="bi bi-chevron-double-left"></i>
          </button>
          <button type="button" className="btn btn-light"
                  onClick={()=>setStartDate(dateUtil.add(startDate,-1,"day"))}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button type="button" className="btn btn-light"
                  onClick={()=>setStartDate(dateUtil.add(startDate,1,"day"))}>
            <i className="bi bi-chevron-right"></i>
          </button>
          <button type="button" className="btn btn-light"
                  onClick={()=>setStartDate(dateUtil.add(startDate,Number(cookie.showDateCount),"day"))}>
            <i className="bi bi-chevron-double-right"></i>
          </button>
          <button type="button" className="btn btn-light"
                  onClick={()=>setStartDate(dateUtil.getTimeReset(new Date()))}>
            <p className="my-0">Today</p>
          </button>
          <div className="input-group">
              <input type="date" className="form-control" aria-label="StartDate" 
                value={dateUtil.format(startDate,"YYYY-MM-DD")}
                onChange={e=>setStartDate(dateUtil.parse(e.target.value))}
              />
            </div>
          <div className="flex-grow-1">
            <div className="input-group">
              <input type="number" className="form-control" aria-label="DateCount" 
                defaultValue={Number(cookie.showDateCount)}
                min={1}
                onChange={e=>setCookie('showDateCount', Number(e.target.value))}
              />
              <span className="input-group-text">Days</span>
            </div>
          </div>
        </div>
      </div>
      <div id="main" className="d-flex" style={
          {height:`${window.innerHeight-(document.getElementById('header')?.clientHeight||0)}px`}
        }>
        <div id="side" className="border-end" style={{
            visibility:showSide?"visible":"collapse",
            width:!showSide?"0px":window.outerWidth>400?"200px":`${window.outerWidth}px`,
            height:"100%"
          }}>
          {
            googleAuthUrl==null ?
            <button type="button" className="btn btn-warning"
                   onClick={async()=>fetch('/api/googlecalendar/grant').then(res=>res.json()).then(res=>{console.log(res);setGoogleAuthUrl(res.url)})}>
              <p className="my-0">Grant Google Connection</p>
            </button> :
            <button type="button" className="btn btn-info">
              <a href={googleAuthUrl}><p className="my-0">Grant Google Connection</p></a>
            </button>
          }
        </div>
        <div id="calendar" style={{height:"100%", width:"100%"}}>
          <div className="row mx-0" style={{height:"100%", width:"100%"}}>
            {[...range(cookie.showDateCount)].map(i=>{
              const date = dateUtil.add(startDate, i, 'day')
              return (
                <div className="col px-0" key={i} 
                     style={{width:`${100/cookie.showDateCount}%`,height:"100%"}}
                >
                  <DayCurtain 
                    date={date}
                    events={eventGroup[dateUtil.getStringDate(date)] || []}
                  />
                </div>
              )
            })
          }
          </div>
        </div>
      </div>
    </div>
  )
}