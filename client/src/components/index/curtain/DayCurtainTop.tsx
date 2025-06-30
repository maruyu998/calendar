import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStatus } from '@client/contexts/StatusProvider';
import { MdateTz } from 'maruyu-webcommons/commons/utils/mdate';
import { useSetting } from '@client/contexts/SettingProvider';
import { useCurtainLayout } from '@client/contexts/CurtainLayoutProvider';

export default function DayCurtainTop({
  dateMdate
}:{
  dateMdate: MdateTz
}){

  const { timezone } = useSetting();
  const { today, currentTime } = useStatus();

  const { widths, updateDayWidth, checkIsDayWidthSet } = useCurtainLayout();

  const [ width, setWidth ] = useState<number>(0);
  const [ isDateWidthSet, setIsDateWidthSet ] = useState<boolean>(false);
  const [ isFocus,  setIsFocus ] = useState<boolean>(false);
  const isToday = useMemo(()=>dateMdate.isToday(), [today, dateMdate, timezone, currentTime])
  
  useEffect(()=>{
    const dateString = dateMdate.format("YYYY-MM-DD");
    const newWidth = widths[dateString] ?? 0
    if(newWidth != width) setWidth(newWidth);
    if(checkIsDayWidthSet(dateMdate) != isDateWidthSet) setIsDateWidthSet(!isDateWidthSet);
  }, [dateMdate, widths])

  const textColor = useMemo(()=>{
    const isSat = dateMdate.format("ddd") === "Sat";
    const isSun = dateMdate.format("ddd") === "Sun";
    return isSat ? "cornflowerblue" : isSun ? "red" : "black";
  }, [dateMdate])

  const setCustomWidth = useCallback((newWidth:number|undefined)=>{
    updateDayWidth(dateMdate, newWidth);
  }, [widths, dateMdate]);

  return (
    <div className="flex flex-row my-1 w-full mx-0">
      <div className="flex-1 m-0 p-0 cursor-zoom-out hover:bg-pink-50" onClick={e=>setCustomWidth(width - 5)}/>
      <div className="flex-0 m-0 px-0 py-auto w-fit cursor-pointer" 
        onDoubleClick={e=>{
          setCustomWidth(isFocus ? undefined : 100);
          setIsFocus(!isFocus);
        }}
      >
        <p className="text-center my-0 w-full" style={{
          fontSize: width > 25 ? "0.5em" : width > 15 ? "0.45em" : "0.25em",
          color: textColor,
          userSelect: "none"
        }}>{dateMdate.format("ddd")}</p>
        <p className="text-center mx-auto my-0 px-1 py-0 w-fit" style={{
          fontSize: width > 25 ? "0.9em" :  width > 15 ? "0.7em" : "0.5em",
          color: isToday ? "white" : "black",
          backgroundColor: isToday ? "tomato" : "white",
          borderRadius: "100%",
          userSelect:"none",
          textDecoration: isDateWidthSet?"underline":""
        }}>{dateMdate.format(dateMdate.get("date")===1?"M/D":"D")}</p>
      </div>
      <div className="flex-1 m-0 p-0 cursor-zoom-in hover:bg-pink-50" onClick={e=>setCustomWidth(width + 5)}/>
    </div>
  )
}