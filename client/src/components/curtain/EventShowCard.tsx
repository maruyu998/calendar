import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { parseColor, isBrightColor } from 'maruyu-webcommons/commons/utils/color';
import { CaleventClientType } from 'mtypes/v2/Calevent';
import { useEditing } from '../../contexts/EditingProvider';
import { useStatus } from '../../contexts/StatusProvider';
import { getBackgroundColor, getFontSize, getMarginTop, getTexts } from '../../utils/card';
import { useDragging } from '../../contexts/DraggingProvider';
import { useEvents } from '../../contexts/EventsProvider';
import { useTop } from '../../contexts/TopProvider';

const BOTTOM_THRESHOLD_PX = 5;
type Ratios = { top:number, left:number, width:number, height:number }

export default function EventShowCard({
  calevent, 
  ratios,
  dayWidth,
  dayHeight,
}:{
  calevent: CaleventClientType,
  ratios: Ratios,
  dayWidth: number,
  dayHeight: number,
}){
  const { deviceGenre } = useTop();
  const { currentTime } = useStatus();
  const { editCalevent } = useEditing();
  const { refreshCaleventByUpdate } = useEvents();
  const { 
    setMouseCoord,
    setDraggingStatus,
    draggingStatusRef,
    setDraggingDateRange,
    draggingDateRangeRef
  } = useDragging();

  const pxs = useMemo(()=>({
    left: ratios.left * dayWidth,
    width: ratios.width * dayWidth,
    top: ratios.top * dayHeight,
    height: ratios.height * dayHeight,
  }), [ratios])

  /////////////////////////////////////////////// style ///////////////////////////////////////////////
  const fontSize = useMemo(()=>getFontSize({width: pxs.width, height: pxs.height}), [pxs]);
  const marginTop = useMemo(()=>getMarginTop({height: pxs.height}), [pxs]);
  const texts = useMemo(()=>getTexts({
    width: pxs.width,
    height: pxs.height,
    title: calevent.title,
    startMdate: calevent.startMdate,
    endMdate: calevent.endMdate
  }), [pxs, calevent])
  const backgroundColor = useMemo(()=>getBackgroundColor(calevent), [currentTime, calevent]);
  const textColor = useMemo(()=>(isBrightColor(parseColor(backgroundColor)) ? "white" : "black"), [currentTime, backgroundColor])
  /////////////////////////////////////////////// style ///////////////////////////////////////////////

  const divRef = useRef<HTMLDivElement|null>(null);
  const [ topHeight, setTopHeight ] = useState<number>(0);
  const [ bottomHeight, setBottomHeight ] = useState<number>(0);
  useEffect(()=>{
    if(divRef.current == null) return;
    const divHeight = divRef.current.getBoundingClientRect().height;
    const bottomHeight = divHeight < BOTTOM_THRESHOLD_PX * 1.5 ? 2 : BOTTOM_THRESHOLD_PX;
    const topHeight = divHeight - bottomHeight;
    setTopHeight(topHeight);
    setBottomHeight(bottomHeight);
  }, []);

  const [ isLongPressing, setIsLongPress ] = useState<boolean>(false);
  const touchTimerRef = useRef<number|null>(null);
  const LONG_PRESS_DURATION = 500;

  return (
    <>
      <div className="shadow-sm absolute overflow-hidden cursor-pointer"
        ref={divRef}
        style={{
          top:`${ratios.top*100}%`,
          left:`${ratios.left*100}%`,
          width:`${ratios.width*100}%`,
          height:`${ratios.height*100}%`,
          border: "solid 0.1px rgba(0,0,0,0.1)",
          borderRadius:"3px",
          backgroundColor,
          opacity: draggingStatusRef.current?.calevent.id == calevent.id ? 0.4 : 1,
        }}
        onTouchStart={e=>{
          if(deviceGenre == "smartphone"){
            touchTimerRef.current = setTimeout(()=>{
              setIsLongPress(true);
            }, LONG_PRESS_DURATION) as unknown as number;
          }
        }}
        onTouchEnd={e=>{
          if(deviceGenre == "smartphone"){
            if(touchTimerRef.current !== null) {
              clearTimeout(touchTimerRef.current);
            }
            if(isLongPressing){

            }else{
              editCalevent(calevent);
            }
            setIsLongPress(false);
          }
        }}
        onClick={e=>{
          if(deviceGenre == "pc"){
            e.stopPropagation();
            if(draggingStatusRef.current?.calevent.id == calevent.id){
              setDraggingStatus({...draggingStatusRef.current, state:"updating"});
              if(draggingDateRangeRef.current){
                refreshCaleventByUpdate({
                  ...calevent,
                  startMdate: draggingDateRangeRef.current.start,
                  endMdate: draggingDateRangeRef.current.end,
                });
              }
            }else{
              setDraggingStatus(null);
              setMouseCoord(null);
              setDraggingDateRange(null);
              editCalevent(calevent);
            }
          }
        }}
      >
        <p className="my-0 py-0 break-all select-none" draggable={false} style={{color:textColor, fontSize, marginTop}}>
          {texts.map((item,ind)=><React.Fragment key={ind}>{item}<br/></React.Fragment>)}
        </p>
        <div className="absolute w-full top-0 cursor-pointer" style={{height: `${topHeight}px`}}
          onPointerMove={event=>{
            if(deviceGenre == "pc"){
              event.stopPropagation();
              if(event.buttons){
                if(draggingStatusRef.current?.calevent.id != calevent.id){
                  setDraggingStatus({
                    state:"top",
                    calevent: calevent,
                    startMouseCoord: {x:event.pageX, y:event.pageY},
                  });
                  event.currentTarget.draggable = false;
                }else{
                  setMouseCoord({x:event.pageX, y:event.pageY});
                }
                event.currentTarget.setPointerCapture(event.pointerId);
              }
            }
          }}
        />
        <div className="absolute w-full bottom-0 cursor-ns-resize" style={{height:`${bottomHeight}px`}}
          onPointerMove={event=>{
            if(deviceGenre == "pc"){
              event.stopPropagation();
              if(event.buttons){
                if(draggingStatusRef.current?.calevent.id != calevent.id) {
                  setDraggingStatus({
                    state:"bottom",
                    calevent: calevent,
                    startMouseCoord: {x:event.pageX, y:event.pageY},
                  });
                  event.currentTarget.draggable = false;
                }else{
                  setMouseCoord({x:event.pageX, y:event.pageY});
                }
                event.currentTarget.setPointerCapture(event.pointerId);
              }
            }
          }}
        />
      </div>
    </>
  )
};