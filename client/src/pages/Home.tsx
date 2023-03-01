import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import DayCurtain from '../components/curtain/DayCurtain';
import DayCurtainTop from '../components/curtain/DayCurtainTop';
import TopBar from '../components/topbar/TopBar';
import SideBar from '../components/sidebar/SideBar';

import MDate from '../../../mutils/mdate';
import { range } from '../../../mutils/number';
import { CalendarEvent, CalendarEventGroup, GCalCalendar } from '../../../mtypes/CalendarEvent';

export default function Home() {

  const [cookie, setCookie] = useCookies(['showDateCount','showSide','heightScale','showingCalendarIds','timezone'])
  const { 
    showSide:c_showSide, 
    showDateCount:c_showDateCount, 
    heightScale:c_heightScale,
    showingCalendarIds:c_showingCalendarIds,
    timezone:c_timezone
  } = cookie
  const cset_showDateCount = (v:string) => setCookie('showDateCount', v)
  const cset_showSide = (v:string) => setCookie('showSide', v)
  const cset_heightScale = (v:string) => setCookie('heightScale', v)
  const cset_showingCalendarIds = (v:string) => setCookie('showingCalendarIds', v)
  const cset_timezone = (v:string) => setCookie('timezone', v)

  if(c_showDateCount===undefined) cset_showDateCount(String(7))
  if(c_showSide===undefined) cset_showSide(String(true))
  if(c_heightScale===undefined) cset_heightScale(String(100))
  if(c_showingCalendarIds===undefined) cset_showingCalendarIds(String([]))
  if(c_timezone===undefined) cset_timezone('Asia/Tokyo')

  const [eventGroup, setEventGroup] = useState<CalendarEventGroup>({});
  const [startDate, setStartDate] = useState<MDate>(MDate.now().getResetTime(c_timezone).add(-1,'day'));
  const [calendarList, setCalendarList] = useState<GCalCalendar[]>([])

  function getCalendarList(){
    fetch('/api/googlecalendar/calendarList').then(res=>res.json()).then(res=>setCalendarList(res.calendarList))
  }
  useEffect(getCalendarList, [])

  function getEvents(){
    const url = new URL('/api/googlecalendar/events', window.location.href)
    url.searchParams.append("group", "date")
    url.searchParams.append("gcids", c_showingCalendarIds)
    url.searchParams.append("timezone", c_timezone)
    url.searchParams.append("start_date", startDate.format("YYYY-MM-DD",c_timezone))
    url.searchParams.append("end_date", startDate.add(Number(c_showDateCount)-1, "day").format("YYYY-MM-DD",c_timezone))
    fetch(url).then(res=>res.json()).then(res=>res.eventGroup as CalendarEventGroup).then(eg=>{
      for(let [dateString, events] of Object.entries(eg)){
        eg[dateString] = events.map(event=>{
          event.start_datetime = new MDate(event.start_datetime.time)
          event.end_datetime = new MDate(event.end_datetime.time)
          return event
        })
      }
      console.log(eg)
      return eg
    }).then(_eventGroup=>setEventGroup(_eventGroup))

  }
  useEffect(getEvents, [c_showingCalendarIds, startDate, c_showDateCount, c_timezone])
  setInterval(getEvents, 1*60*1000)

  return (
    <div style={{overflowY:"hidden"}}>
      <TopBar 
        startDate={startDate}
        setStartDate={setStartDate}
        c_showSide={c_showSide}
        cset_showSide={cset_showSide}
        c_showDateCount={c_showDateCount}
        cset_showDateCount={cset_showDateCount}
        c_heightScale={c_heightScale}
        cset_heightScale={cset_heightScale}
        c_timezone={c_timezone}
        cset_timezone={cset_timezone}
      />
      <div id="main" className="d-flex" style={{
          height:`${window.innerHeight-(document.getElementById('header')?.clientHeight||0)}px`
        }}>
        <SideBar 
          calendarList={calendarList}
          getCalendarList={getCalendarList}
          c_showSide={c_showSide}
          c_showingCalendarIds={c_showingCalendarIds}
          cset_showingCalendarIds={cset_showingCalendarIds}
        />
        <div id="calendar" style={{height:"100%", width:"100%", overflow:"hidden"}}>
          <div className="row mx-0" style={{width:"100%"}}>
            {[...range(c_showDateCount)].map(i=>(
              <div className="col px-0" key={i} style={{width:`${100/c_showDateCount}%`}}>
                <DayCurtainTop date={startDate.add(i,'day')} c_timezone={c_timezone} />
              </div>
              )
            )}
          </div>
          <div className="row mx-0" style={{width:"100%",overflow:"auto"}}>
            {[...range(c_showDateCount)].map(i=>{
              const date = startDate.add(i,'day')
              return (
                <div className="col px-0" key={i} style={{width:`${100/c_showDateCount}%`,height:"100%"}}>
                  <DayCurtain
                    date={date}
                    c_timezone={c_timezone}
                    calendarList={calendarList}
                    events={eventGroup[date.getDateString(c_timezone)] || []}
                    heightScale={c_heightScale}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}