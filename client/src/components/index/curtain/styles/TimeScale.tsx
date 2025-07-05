import { useMemo, useRef, useEffect, useState } from "react";
import { numberRange as range } from "@ymwc/utils";
import { getDivRefWidth } from "@client/utils/ReactRect";
import { MdateTz } from "@ymwc/mdate";
import { useSetting } from "@client/contexts/SettingProvider";
import { HOUR } from "@ymwc/utils";

export default function TimeScale(){
  const { timezone } = useSetting();

  const firstRef = useRef<HTMLDivElement|null>(null);
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const updateWidth = () => {
      const newWidth = getDivRefWidth(firstRef);
      if (newWidth > 0) {
        setWidth(newWidth);
      }
    };
    
    updateWidth();
    // 少し遅延して再計算（初期レンダリング後）
    const timer = setTimeout(updateWidth, 100);
    return () => clearTimeout(timer);
  }, []);
  const startEndRanges = useMemo(()=>{
    return [...range(25)].map(i=>{
      const startR = (i===0) ? 0 : new MdateTz(undefined, timezone).resetTime().addMs((i-0.5)*HOUR).getRatio("date");
      const endR = (i===24) ? 1 : new MdateTz(undefined, timezone).resetTime().addMs((i+0.5)*HOUR).getRatio("date");
      return {startR, endR}
    });
  }, []);

  return (
    <div style={{width: width > 0 ? `${width}px` : "60px", height:"100%", position:"relative"}}>
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