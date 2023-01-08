import React from 'react';
import MinuteCurtain from './MinuteCurtain';
import { CalendarEvent } from '../../../mtypes/CalendarEvent';
import * as DateUtil from '../../../mutils/date';

export default function DayCurtain({date,events}:{date:Date,events:CalendarEvent[]}){
  const isToday = DateUtil.isToday(date);
  const isSat = DateUtil.getMediumDOW(date) === "Sat";
  const isSun = DateUtil.getMediumDOW(date) === "Sun";

  const docElm = (id)=>document.getElementById(id)

  return (
    <div style={{height:"100%", width:"100%"}}>
      <div id="dayhead" className="my-2">
        <p className="text-center my-0" style={{
          fontSize:"8px",
          color: isSat ? "cornflowerblue" : isSun ? "red" : "black",
          width: "100%"
        }}>{DateUtil.format(date,"ww")}</p>
        <p className="text-center mx-auto my-0 px-1 py-1" style={{
          fontSize:"16px",
          color: isToday ? "white" : "black",
          backgroundColor: isToday ? "tomato" : "white",
          borderRadius: "100%",
          width:"fit-content"
        }}>{DateUtil.format(date,"M/D")}</p>
      </div>
      <div className="border-end" style={{
        height:`${(docElm('main')?.clientHeight||0)-(docElm('dayhead')?.clientHeight||0)}px`
      }}>
        {
          events.map((event,i)=>(
            <div>

            </div>
          ))
        }
      </div>
    </div>
  )
}