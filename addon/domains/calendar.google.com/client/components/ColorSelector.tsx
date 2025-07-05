import { RiCheckLine, RiPencilLine, RiResetLeftFill } from "@remixicon/react";
import { HexColorType } from "@ymwc/utils";
import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { convertColidToColor } from "../../share/func/googleCalevent";
import { GoogleCaleventColorList } from "../../share/types/googleCalevent";

export default function ColorSelector({
  colorId,
  defaultColor,
  setColorId,
}:{
  colorId: number,
  defaultColor: HexColorType,
  setColorId: (v:number)=>void,
}){
  const [ editing, setEditing ] = useState<boolean>(false);
  const colorPalletRef = useRef<HTMLDivElement|null>(null);
  useEffect(()=>{
    if(editing && colorPalletRef.current) colorPalletRef.current.focus();
  }, [ editing ]);
  return (
    <div className="relative inline-block">
      <div className="rounded-full w-5 h-5 cursor-pointer" 
        style={{ backgroundColor: convertColidToColor(colorId) ?? defaultColor }}
        onClick={()=>setEditing(true)}
      ></div>
      { editing && (
        <div className="
            absolute top-6 left-0 
            bg-white border border-gray-300 shadow rounded p-2 grid grid-cols-6
            gap-1 z-auto w-36
          "
          tabIndex={0}
          ref={colorPalletRef}
          onBlur={()=>setEditing(false)}
        >
          {GoogleCaleventColorList.map((color, idx)=>(
            <div key={idx} className="w-5 h-5 rounded-full cursor-pointer border border-gray-300"
              style={{ backgroundColor: color ?? defaultColor }}
              onClick={()=>{ setColorId(idx); setEditing(false); }}
              title={`Color ${idx}`}
            ></div>
          ))}
        </div>
      )}
    </div>
  )
}