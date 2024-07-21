import React, { useEffect, useMemo } from 'react';
import { parseColor, isBrightColor } from 'maruyu-webcommons/commons/utils/color';
import { MdateTz } from 'maruyu-webcommons/commons/utils/mdate';
import { useEvents } from '../../contexts/EventsProvider';
import { useStatus } from '../../contexts/StatusProvider';
import { CaleventClientType } from 'mtypes/v2/Calevent';
import { useEditing } from '../../contexts/EditingProvider';
import { getBackgroundColor } from '../../utils/card';

const DAYEVENT_HEIGHT = 15;

export default function DayEventCurtain({
  date
}:{
  date: MdateTz
}){
  const { dayEventGroup } = useEvents();
  const { editCalevent } = useEditing();
  const dayCalevents = useMemo<CaleventClientType[]>(()=>{
    const dateString = date.format("YYYY-MM-DD");
    return ((dayEventGroup[dateString]||[]).sort((a,b)=>a.startMdate.unix-b.startMdate.unix));
  }, [date, dayEventGroup])

  return (
    <div className="border-end w-full" draggable={false}>
      { dayCalevents.map(calevent=>{
        const backgroundColor = getBackgroundColor(calevent);
        const textColor = isBrightColor(parseColor(backgroundColor)) ? "white" : "black";
        return (
          <React.Fragment key={calevent.id}>
            <div 
              className="shadow-sm" 
              onClick={()=>editCalevent(calevent)} 
              style={{
                overflow:"hidden", 
                borderRadius:"3px",
                width: "100%",
                height:`${DAYEVENT_HEIGHT}px`,
                border: "solid 0.2px rgba(0,0,0,0.2)",
                backgroundColor
              }}
            >
              <p className='my-0 py-0' draggable={false} style={{
                color: textColor, 
                fontSize: "0.7em", 
                wordBreak:"break-all", 
                userSelect:"none"
              }}>
                {calevent.title}
              </p>
            </div>
          </React.Fragment>
        )})
      }
    </div>
  )
}