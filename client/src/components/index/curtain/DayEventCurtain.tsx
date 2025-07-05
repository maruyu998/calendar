import React, { useEffect, useMemo } from 'react';
import { parseColor, isBrightColor } from '@ymwc/utils';
import { MdateTz } from '@ymwc/mdate';
import { useEvents } from '@client/contexts/EventsProvider';
import { CaleventType } from '@client/types/calevent';
import { useEditing } from '@client/contexts/EditingProvider';
import { getBackgroundColor } from '@client/utils/card';

const DAYEVENT_HEIGHT = 12;

export default function DayEventCurtain({
  dateMdate
}:{
  dateMdate: MdateTz
}){
  const { dayEventGroup } = useEvents();
  const { editCalevent } = useEditing();
  const dayCalevents = useMemo<CaleventType[]>(()=>{
    const dateString = dateMdate.format("YYYY-MM-DD");
    return ((dayEventGroup[dateString]||[]).sort((a,b)=>a.startMdate.unix-b.startMdate.unix));
  }, [dateMdate, dayEventGroup])

  return (
    <div className="border-e border-gray-200 w-full" draggable={false}>
      { dayCalevents.map(calevent=>{
        const backgroundColor = getBackgroundColor(calevent);
        const textColor = isBrightColor(parseColor(backgroundColor)) ? "white" : "black";
        return (
          <React.Fragment key={calevent.id}>
            <div 
              className="shadow-sm" 
              onClick={()=>editCalevent(calevent)} 
              title={calevent.title}
              style={{
                overflow:"hidden",
                borderRadius:"3px",
                width: "100%",
                height:`${DAYEVENT_HEIGHT}px`,
                border: "solid 0.2px rgba(0,0,0,0.2)",
                backgroundColor
              }}
            >
              <p className='my-[-0.2em] py-0' draggable={false} style={{
                color: textColor,
                fontSize: "0.6em",
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