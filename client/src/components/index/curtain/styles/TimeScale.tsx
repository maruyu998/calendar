import { useEffect, useMemo, useRef, useState } from "react";
import { range } from "maruyu-webcommons/commons/utils/number";
import { getDivRefWidth } from "@client/utils/ReactRect";
import { MdateTz } from "@ymwc/mdate";
import { useSetting } from "@client/contexts/SettingProvider";
import { HOUR } from "maruyu-webcommons/commons/utils/time";

export default function TimeScale(){
  const { timezone } = useSetting();

  const firstRef = useRef<HTMLDivElement>(null);
  const width = useMemo(()=>getDivRefWidth(firstRef), [firstRef.current]);
  const startEndRanges = useMemo(()=>{
    return [...range(25)].map(i=>{
      const startR = (i===0) ? 0 : new MdateTz(undefined, timezone).resetTime().addMs((i-0.5)*HOUR).getRatio("date");
      const endR = (i===24) ? 1 : new MdateTz(undefined, timezone).resetTime().addMs((i+0.5)*HOUR).getRatio("date");
      return {startR, endR}
    });
  }, []);

  return (
    <div style={{width: `${width}px`, height:"100%", position:"relative"}}>
      {
        startEndRanges.map(({ startR, endR }, i)=>(
          <div key={i} ref={i===0?firstRef:undefined}
            className={`
              px-1 flex ${(i===0 ? "items-start" : i===24 ? "items-end" : "items-center")}
            `}
            style={{
              position: "absolute",
              top: `${startR*100}%`,
              height: `${(endR-startR)*100}%`
            }}
          >
            <p className="m-0 align-middle" style={{fontSize:"8px"}}>{`0${i}`.slice(-2)}</p>
          </div>
        ))
      }
    </div>
  )
}