import React, { useEffect, useMemo } from 'react';
import { useStateRef } from 'maruyu-webcommons/react/reactUse';
import { parseColor, isBrightColor } from 'maruyu-webcommons/commons/utils/color';
import { MdateTz } from '@ymwc/mdate';
import { useSetting } from '@client/contexts/SettingProvider';
import { CaleventType } from '@client/types/calevent';
import { useStatus } from '@client/contexts/StatusProvider';
import { DAY } from 'maruyu-webcommons/commons/utils/time';
import { updateCalevent } from '@client/data/calevent';
import { useEvents } from '@client/contexts/EventsProvider';
import { getBackgroundColor, getFontSize, getMarginTop, getTexts } from '@client/utils/card';
import { ProcessStateType, useDragging } from '@client/contexts/DraggingProvider';
import { useCurtainLayout } from '@client/contexts/CurtainLayoutProvider';
import { range } from 'maruyu-webcommons/commons/utils/number';
import { useToast } from 'maruyu-webcommons/react/toast';
import { convertUpdateItemResponseToClient } from '@client/types/calevent';

type Ratios = { top:number, left:number, width:number, height:number }

export default function EventDraggingCardWrapper(){
  const { 
    draggingStatusRef,
    draggingDateRangeRef
  } = useDragging();
  if(draggingStatusRef.current == null) return <></>;
  if(draggingDateRangeRef.current == null) return <></>;

  return (
    <EventDraggingCards
      calevent={draggingStatusRef.current.calevent}
      processState={draggingStatusRef.current.state}
      startDraggingMdate={draggingDateRangeRef.current.start}
      endDraggingMdate={draggingDateRangeRef.current.end}
    />
  )
}

function EventDraggingCards({
  calevent,
  processState,
  startDraggingMdate,
  endDraggingMdate,
}:{
  calevent: CaleventType,
  processState: ProcessStateType
  startDraggingMdate: MdateTz,
  endDraggingMdate: MdateTz
}){
  const { addToast } = useToast();
  const { timezone } = useSetting();
  const { calendarList } = useStatus();
  const { refreshCaleventByUpdate } = useEvents();
  const { 
    setDraggingStatus,
    setMouseCoord,
    setDraggingDateRange,
  } = useDragging();
  
  useEffect(()=>{
    setDraggingDateRange({start: calevent.startMdate, end: calevent.endMdate})
  }, [calevent])
  
  const reset = useMemo(()=>function(){
    setDraggingStatus(null);
    setMouseCoord(null);
    setDraggingDateRange(null);
  }, []);

  useEffect(()=>{
    if(processState == "updating") {
      if(startDraggingMdate.unix == calevent.startMdate.unix
        && endDraggingMdate.unix == calevent.endMdate.unix
      ) return reset();
      updateCalevent({
        caleventId: calevent.id,
        calendarId: calevent.calendarId,
        startTime: startDraggingMdate.toDate(),
        endTime: endDraggingMdate.toDate(),
      })
      .then(responseObject=>convertUpdateItemResponseToClient(responseObject, calendarList, timezone))
      .then(calevent=>{
        refreshCaleventByUpdate(calevent.id, { 
          title: calevent.title,
          startMdate: calevent.startMdate,
          endMdate: calevent.endMdate,
        });  // この行
      })
      .catch(error=>{
        addToast("UpdateError", error.message, "error");
        reset();
      });
      // setTargetCalevent(null); // この行があると、なぜかratioに変化が生じて、上のuseEffectが発火する
      reset();
    }
  }, [processState])

  const [, setSplitted, splittedRef] = useStateRef<{startMdate:MdateTz,endMdate:MdateTz}[]>([]);
  useEffect(()=>{
    const list = new Array<MdateTz>();
    for(
      let mdate=startDraggingMdate; 
      mdate.unix<endDraggingMdate.unix; 
      mdate=mdate.forkAdd(1,"date").resetTime()
    ) list.push(mdate);
    if(list.length > 0 && list.at(-1)!.unix != endDraggingMdate.unix) list.push(endDraggingMdate);
    setSplitted([...range(list.length-1)].map(i=>({ startMdate:list[i], endMdate:list[i+1] })));
  }, [startDraggingMdate, endDraggingMdate])

  return (
    <div>
      { splittedRef.current.map(({startMdate, endMdate}, i)=>(
        <React.Fragment key={i}>
          <EventDraggingCard 
            calevent={calevent}
            cardStartMdate={startMdate}
            cardEndMdate={endMdate}
            caleventStartMdate={startDraggingMdate}
            caleventEndMdate={endDraggingMdate}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

function EventDraggingCard({
  calevent,
  cardStartMdate,
  cardEndMdate,
  caleventStartMdate,
  caleventEndMdate,
}:{
  calevent: CaleventType,
  cardStartMdate: MdateTz,
  cardEndMdate: MdateTz,
  caleventStartMdate: MdateTz
  caleventEndMdate: MdateTz
}){
  const { widths, curtainVirtualHeight } = useCurtainLayout();

  const [, setShowingGlobalRatios, showingRatiosGlobalRef ] = useStateRef<Ratios|null>(null);

  const widthPx = useMemo(()=>{
    const dateString = cardStartMdate.format("YYYY-MM-DD");
    return widths[dateString];
  }, [widths, cardStartMdate])
  const heightPx = useMemo(()=>{
    if(showingRatiosGlobalRef.current == null) return 0;
    return curtainVirtualHeight * showingRatiosGlobalRef.current.height;
  }, [curtainVirtualHeight, showingRatiosGlobalRef.current])
  
  /////////////////////////////////////////////// style ///////////////////////////////////////////////
  const fontSize = useMemo(()=>getFontSize({width:widthPx, height:heightPx}), [widthPx, heightPx]);
  const marginTop = useMemo(()=>getMarginTop({height:heightPx}), [heightPx]);
  const texts = useMemo(()=>getTexts({
    width: widthPx,
    height: heightPx,
    startMdate: caleventStartMdate,
    endMdate: caleventEndMdate,
    title: calevent.title
  }), [widthPx, heightPx, caleventStartMdate, caleventEndMdate, calevent])
  const backgroundColor = useMemo(()=>getBackgroundColor(calevent), [calevent, cardStartMdate, cardEndMdate]);
  const textColor = useMemo(()=>(
    isBrightColor(parseColor(backgroundColor)) ? "white" : "black"
  ), [backgroundColor, calevent, cardStartMdate, cardEndMdate]);

  useEffect(()=>{
    const top = (cardStartMdate.unix - cardStartMdate.resetTime().unix) / DAY;
    const height = (cardEndMdate.unix - cardStartMdate.unix) / DAY;
    const dateString = cardStartMdate.format("YYYY-MM-DD");
    let leftCum = 0;
    let allCum = 0;
    for(const [key,value] of Object.entries(widths)){
      if(key<dateString) leftCum += value;
      allCum += value;
    }
    const left = leftCum / allCum;
    const width = widthPx / allCum * 0.95;
    setShowingGlobalRatios({top, height, left, width});
  }, [cardStartMdate, cardEndMdate]);
  /////////////////////////////////////////////// style ///////////////////////////////////////////////

  if(showingRatiosGlobalRef.current == null) return <></>;
  return (
    <>
      <div className="shadow-sm absolute overflow-hidden cursor-pointer"
        style={{
          top:`${showingRatiosGlobalRef.current.top*100}%`,
          left:`${showingRatiosGlobalRef.current.left*100}%`,
          width:`${showingRatiosGlobalRef.current.width*100}%`,
          height:`${showingRatiosGlobalRef.current.height*100}%`,
          border: "solid 0.1px rgba(0,0,0,0.1)",
          borderRadius:"3px",
          backgroundColor,
          zIndex: "100",
          boxShadow: "0 10px 25px 0 rgba(0,0,0,.5)"
        }}
      >
        <p className="my-0 py-0 break-all select-none" draggable={false} style={{color:textColor, fontSize, marginTop}}>
          {texts.map((item,ind)=><React.Fragment key={ind}>{item}<br/></React.Fragment>)}
        </p>
      </div>
    </>
  )
}