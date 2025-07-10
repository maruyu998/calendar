import React, { useMemo } from 'react';
import { parseColor, isBrightColor } from '@ymwc/utils';
import { MdateTz } from '@ymwc/mdate';
import { useEvents } from '@client/contexts/EventsProvider';
import { useSetting } from '@client/contexts/SettingProvider';
import { CaleventType } from '@client/types/calevent';
import { useEditing } from '@client/contexts/EditingProvider';
import { getBackgroundColor } from '@client/utils/card';
import { randomizeText } from '@client/utils/demoMode';

const DAYEVENT_HEIGHT = 12;

export default function DayEventCurtain({
  dateMdate
}:{
  dateMdate: MdateTz
}){
  const { dayEventGroup } = useEvents();
  const { editCalevent } = useEditing();
  const { demoMode } = useSetting();
  const dayCalevents = useMemo<CaleventType[]>(()=>{
    const dateString = dateMdate.format("YYYY-MM-DD");
    return ((dayEventGroup[dateString]||[]).sort((a,b)=>a.startMdate.unix-b.startMdate.unix));
  }, [dateMdate, dayEventGroup])

  return (
    <div className="border-e border-gray-200 w-full" draggable={false}>
      { dayCalevents.map(calevent=>{
        const backgroundColor = getBackgroundColor(calevent);
        const textColor = isBrightColor(parseColor(backgroundColor)) ? "white" : "black";
        const displayTitle = demoMode ? randomizeText(calevent.title) : calevent.title;
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
                backgroundColor,
                filter: demoMode ? "blur(3px)" : "none",
              }}
            >
              <p className='my-[-0.2em] py-0' draggable={false} style={{
                color: textColor,
                fontSize: "0.6em",
                wordBreak:"break-all",
                userSelect:"none"
              }}>
                {displayTitle}
              </p>
            </div>
          </React.Fragment>
        )})
      }
    </div>
  )
}