import { RiCheckLine, RiPencilLine, RiResetLeftFill } from "@remixicon/react";
import { HexColorType } from "@ymwc/utils";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

export default function ColorSelector({
  color,
  setColor,
}:{
  color: HexColorType
  setColor: (v:HexColorType)=>void,
}){
  const [ editing, setEditing ] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <div className="mb-1 flex gap-x-2">
          <span className="text-sm font-medium text-gray-900">Color</span>
          <p className="text-sm font-mono">{color}</p>
          <div className="w-5 h-5 rounded-full border cursor-pointer"
            style={{backgroundColor:color}}
            onClick={()=>setEditing(true)}
          />
        </div>
      </div>
      { editing && (
        <div className="relative">
          <HexColorPicker color={color} onChange={v=>setColor(v as HexColorType)}></HexColorPicker>
          <button
            onClick={()=>setEditing(false)}
            className="absolute bottom-0 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-md"
            title="保存"
          >
            <RiCheckLine size={16}/>
          </button>
        </div>
      )}
    </>
  )
}