import React from 'react';
import MinuteCurtain from './MinuteCurtain';
import { CalendarEvent, GCalCalendar } from 'mtypes/CalendarEvent';
import MDate from '../../../../mutils/mdate';
import * as MDateRange from '../../../../mutils/mdaterange';

export default function DayCurtain({
  date,events,calendarList,heightScale,c_timezone
}:{
  date:MDate,
  events:CalendarEvent[],
  calendarList:GCalCalendar[]
  heightScale:number,
  c_timezone:string
}){

  events = events.sort((a,b)=>a.start_datetime.time-b.start_datetime.time)

  const docElm = (id)=>document.getElementById(id)

  function getTimeRatio(date:MDate){
    return date.getDaySecond(c_timezone) / (24 * 60 * 60)
  }

  function calc_overwraps(){
    const overwraps:{index:number, event:CalendarEvent}[][] = []
    events.forEach((event,index)=>{
      let break_flg = false
      for(let ow of overwraps){
        if(break_flg) break
        for(let o of ow){
          if(break_flg) break
          if(MDateRange.isOverwrapped(
            {start: event.start_datetime, end:event.end_datetime},
            {start: o.event.start_datetime, end:o.event.end_datetime}
          )){
            ow.push({index,event})
            break_flg = true
          }
        }
      }
      if(!break_flg) overwraps.push([{index,event}])
    })
    const positions = events.map(()=>({length:0, position:0}))
    for(let ow of overwraps){
      ow.forEach((o,i)=>{
        positions[o.index].length = ow.length
        positions[o.index].position = i
      })
    }
    return positions
  }
  const positions = calc_overwraps()

  return (
    <div className="" style={{height:"100%", width:"100%", overflow:"hidden"}}>
      <div className="border-end w-100" style={{
        height:`${((docElm('main')?.clientHeight||0)-(docElm('dayhead')?.clientHeight||0))*heightScale/100}px`,
        position: "relative"
      }}>
        {
          events.map((event,i)=>{
            const start = event.start_datetime.time-date.getResetTime(c_timezone).time >= 0 ? getTimeRatio(event.start_datetime)*100 : 0
            const end = date.getResetTime(c_timezone).add(1,'day').time - event.end_datetime.time > 0 ? getTimeRatio(event.end_datetime)*100 : 100
            return (
              <div key={i} className="shadow-sm" style={{
                position: "absolute",
                top: `${start}%`,
                minHeight: "18px",
                height: `${end-start}%`,
                backgroundColor: (event.display_styles.background_color !== 'default') 
                                ? event.display_styles.background_color 
                                : calendarList.filter(c=>c.id===event.calendar_id)[0].backgroundColor,
                width: `${100-(positions[i].length)*10}%`,
                left:`${positions[i].position*5}%`,
                border: "solid 0.2px rgba(0,0,0,0.2)",
                borderRadius: "3px"
              }}>
                <p className='text-white my-0 py-0' style={{fontSize:"6px",textShadow:"0px 0px 2px #000",wordBreak:"break-all"}}>
                  {event.title}<br/>{event.start_datetime.format("HH:mm",c_timezone)}~{event.end_datetime.format("HH:mm",c_timezone)}
                </p>
              </div>
            )})
        }
      </div>
    </div>
  )
}