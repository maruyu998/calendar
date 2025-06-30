import { RiCheckLine, RiPencilLine, RiResetLeftFill, RiRestartLine } from '@remixicon/react';
import { useEffect, useState } from 'react';

export default function EstimatedMinutesForm({
  estimatedMinute,
  setEstimatedMinute,
}:{
  estimatedMinute: number,
  setEstimatedMinute: (v:number)=>void,
}){
  function genText(estMin:number){
    const hour = Math.floor(estMin / 60);
    const min = estMin % 60;
    return `${hour}h ${('0' + min).slice(-2)}m`;
  }

  return (
    <div className="flex justify-between items-center gap-x-1 mb-2">
      <span className={`
        text-sm font-medium
        ${estimatedMinute == 0 ? "text-red-600" : "text-gray-900"}
      `}>Est.</span>
      <span className={`
        text-sm font-normal whitespace-pre-wrap
        ${estimatedMinute == 0 ? "text-white" : "text-gray-900"}
      `}>{genText(estimatedMinute)}</span>
      <input className="flex-1"
        type="range" min={15} max={240} step={15} defaultValue={estimatedMinute??15}
        onChange={e => setEstimatedMinute(Number(e.target.value))}
      />
    </div>
  )
}