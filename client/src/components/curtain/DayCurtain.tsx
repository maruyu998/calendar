import React, { useEffect, useMemo } from 'react';
import { range } from 'maruyu-webcommons/commons/utils/number';
import { MdateTz } from 'maruyu-webcommons/commons/utils/mdate';
import { useSetting } from '../../contexts/SettingProvider';
import { useCurtainLayout } from '../../contexts/CurtainLayoutProvider';
import { useEvents } from '../../contexts/EventsProvider';
import { CaleventClientType } from 'mtypes/v2/Calevent';
import { useEditing } from '../../contexts/EditingProvider';
import EventShowCard from './EventShowCard';
import { useStatus } from '../../contexts/StatusProvider';

const EVENT_MIN_HEIGHT = 8;

export default function DayCurtain({
  dateMdate,
}:{
  dateMdate:MdateTz,
}){
  const { timezone } = useSetting();
  const { curtainVirtualHeight: dayHeight } = useCurtainLayout();
  const { today, currentTime } = useStatus();
  const { widths } = useCurtainLayout();
  const { createCalevent } = useEditing();

  const dayWidth = useMemo(()=>{
    const dateString = dateMdate.format("YYYY-MM-DD");
    return widths[dateString] ?? 0;
  }, [dateMdate, widths])

  const { eventGroup } = useEvents();
  const calevents = useMemo<CaleventClientType[]>(()=>{
    const dateString = dateMdate.format("YYYY-MM-DD");
    return (eventGroup[dateString]||[])
            .filter(event=>(
                event.startMdate.unix < dateMdate.forkAdd(1,"date").unix
              && event.endMdate.unix >= dateMdate.unix
            ))
            .sort((a,b)=>a.startMdate.unix - b.startMdate.unix);
  }, [dateMdate, eventGroup]);

  const calcEventY = useMemo(()=>function(start:MdateTz, end:MdateTz){
    const startRatio = (start.unix - dateMdate.resetTime().unix >= 0) ? start.getRatio("date") : 0;
    const endRatio = (end.unix - dateMdate.resetTime().forkAdd(1,'date').unix < 0) ? end.getRatio("date") : 1;
    let topRatio = startRatio;
    let heightRatio = endRatio - topRatio;
    if(heightRatio < EVENT_MIN_HEIGHT / dayHeight){
      heightRatio = EVENT_MIN_HEIGHT / dayHeight;
      if(topRatio + EVENT_MIN_HEIGHT / dayHeight > 1) topRatio = 1 - heightRatio;
    }
    const bottomRatio = topRatio + heightRatio;
    return {topRatio, heightRatio, bottomRatio}
  }, [dateMdate, dayHeight]);
  const eventsY = useMemo(()=>{
    return Object.assign({}, ...calevents.map(e=>({[e.id]: calcEventY(e.startMdate, e.endMdate)})));
  }, [calevents, timezone, dayHeight]);
  const isOverwrapped = useMemo(()=>function(e1,e2){return (e1.topRatio-e2.bottomRatio)*(e1.bottomRatio-e2.topRatio)<0}, []);

  const positions = useMemo(()=>{
    const _positions = {};
    const positionRows:Array<Record<string,{topRatio:number,bottomRatio:number}>> = []
    for(let event of calevents){
      let done = false;
      for(let row of positionRows){
        if(done) break;
        if(Object.values(row).filter(eventy=>isOverwrapped(eventsY[event.id], eventy)).length > 0) continue;
        row[event.id] = eventsY[event.id];
        done = true;
      }
      if(!done) positionRows.push({[event.id]: eventsY[event.id]})
    }
    positionRows.forEach((row, index)=>{
      Object.entries(row).forEach(([id, eventy])=>{
        let length = 1
        positionRows.forEach((rowC,indexC)=>{
          if(index === indexC) return;
          if(Object.values(rowC).filter(eventyC=>isOverwrapped(eventy,eventyC)).length === 0) return;
          length += 1
        })
        _positions[id] = {index, length}
      })
    })
    return _positions;
  }, [calevents, eventsY]);  

  const calcEventX = useMemo(()=>function(id:string){
    const discount = 0.95;
    const widthRatio = 1 / positions[id].length * discount;
    const leftRatio = widthRatio * positions[id].index;
    return { leftRatio, widthRatio }
  }, [positions]);
  const eventsX = useMemo(()=>{
    return Object.assign({}, ...calevents.map(e=>({[e.id]: calcEventX(e.id)})))
  }, [calevents, positions, dayWidth]);
  
  const topRatios = useMemo(()=>{
    return [...range(24)].map(i=>new MdateTz(undefined, timezone).resetTime().forkAdd(i,'hour').getRatio("date")*100);
  }, [timezone]);
  const isToday = useMemo(()=>dateMdate.isToday(), [dateMdate, today, currentTime, timezone]);
  const barRatio = useMemo(()=>new MdateTz(undefined, timezone).getRatio("date")*100, [timezone, currentTime]);

  return (
    <div className="border-e border-gray-200 w-full" draggable={false} style={{height:"100%",position:"relative"}}
      onClick={e=>{
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientY - rect.top) / dayHeight;
        let per15 = Math.ceil(ratio*24*60);
        per15 = per15 - per15 % 15;
        createCalevent(dateMdate.resetTime().forkAdd(per15,'minute'));
      }}
    >
      {
        topRatios.map((ratio, i)=>(
          <div className="z-n1" key={i} style={{
            top:`${ratio}%`,
            width:"100%",height:"0.5px",position:"absolute",backgroundColor:i%3===0?"rgba(10,120,10,0.4)":"rgba(0,0,0,0.1)"
          }}/>
        ))
      }
      { calevents.map(calevent=>(
        <React.Fragment key={calevent.id}>
          <EventShowCard
            calevent={calevent} 
            ratios={{
              top: eventsY[calevent.id].topRatio,
              left: eventsX[calevent.id].leftRatio,
              width: eventsX[calevent.id].widthRatio,
              height: eventsY[calevent.id].heightRatio
            }}
            dayWidth={dayWidth}
            dayHeight={dayHeight}
          />
        </React.Fragment>
      ))}
      {
        isToday &&
        <div className="z-30 absolute w-full" style={{
          top:`${barRatio}%`,
          height:"2px",
          backgroundColor:"rgba(255,0,0,0.8)"
        }}/>
      }
    </div>
  )
}