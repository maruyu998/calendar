import React, { useEffect, useMemo, useState } from 'react';
import { useStatus } from '../../contexts/StatusProvider';
import { MdateTz } from 'maruyu-webcommons/commons/utils/mdate';
import { useSetting } from '../../contexts/SettingProvider';
import { useCurtainLayout } from '../../contexts/CurtainLayoutProvider';

export default function DayCurtainTop({
  date
}:{
  date: MdateTz
}){

  const { timezone } = useSetting();
  const { today, currentTime } = useStatus();

  const { dayWidths, setDayWidths } = useCurtainLayout();
  const { widths } = useCurtainLayout();

  const [ width, setWidth ] = useState<number>(0);
  const isToday = useMemo(()=>date.isToday(), [today, date, timezone, currentTime])
  useEffect(()=>{
    const dateString = date.format("YYYY-MM-DD");
    setWidth(widths[dateString]);
  }, [date, widths])
  const [ isFocus,  setIsFocus ] = useState<boolean>(false);
  const textColor = useMemo(()=>{
    const isSat = date.format("ddd") === "Sat";
    const isSun = date.format("ddd") === "Sun";
    return isSat ? "cornflowerblue" : isSun ? "red" : "black";
  }, [date])

  const setCustomWidth = useMemo(()=>function(n_width){
    dayWidths.exact[date.format("YYYY-MM-DD")] = n_width
    setDayWidths({...dayWidths})
  }, [dayWidths, setDayWidths, date]);

  return (
    <div className="flex flex-row my-1 w-full mx-0">
      <div className="flex-1 m-0 p-0" onClick={e=>setCustomWidth(width - 5)} style={{cursor:"zoom-out"}}/>
      <div className="flex-auto m-0 px-0 py-auto" style={{width:"fit-content"}} onDoubleClick={e=>{
        setCustomWidth(isFocus ? undefined : 100)
        setIsFocus(!isFocus)
      }}>
        <p className="text-center my-0" style={{
          fontSize: width > 25 ? "0.5em" : width > 15 ? "0.45em" : "0.25em",
          color: textColor,
          width: "100%",
          userSelect:"none"
        }}>{date.format("ddd")}</p>
        <p className="text-center mx-auto my-0 px-1 py-0" style={{
          fontSize: width > 25 ? "0.9em" :  width > 15 ? "0.7em" : "0.5em",
          color: isToday ? "white" : "black",
          backgroundColor: isToday ? "tomato" : "white",
          borderRadius: "100%",
          width:"fit-content",
          userSelect:"none",
          textDecoration:dayWidths.exact[date.format("YYYY-MM-DD")]?"underline":""
        }}>{date.format(date.get("date")===1?"M/D":"D")}</p>
      </div>
      <div className="flex-1 m-0 p-0" onClick={e=>setWidth(width + 5)} style={{cursor:"zoom-in"}}/>
    </div>
  )
}