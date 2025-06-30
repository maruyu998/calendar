import { RiCheckLine, RiPencilLine, RiResetLeftFill, RiRestartLine } from '@remixicon/react';
import { MdateTz, TimeZone } from 'maruyu-webcommons/commons/utils/mdate';
import { useEffect, useMemo, useState } from 'react';
import { createDurationText, createTimeRangeText } from '@addon/client/utils/duration';

export default function DurationForm({
  startMdate,
  endMdate,
  timezone,
  setDuration,
}:{
  startMdate: MdateTz,
  endMdate: MdateTz,
  timezone: TimeZone,
  setDuration: (startMdate:MdateTz,endMdate:MdateTz)=>void,
}){
  const [ editing, setEditing ] = useState<boolean>(false);
  useEffect(()=>{ setEditing(false) }, [startMdate, endMdate]);

  const timeRangeText = useMemo(()=>createTimeRangeText(startMdate, endMdate), [ startMdate, endMdate, timezone ]);
  const durationText = useMemo(()=>createDurationText(startMdate, endMdate), [ startMdate, endMdate, timezone ]);

  const defaultUpdatingDatetime = useMemo(()=>({start:startMdate, end:endMdate, keepduration:true}),[startMdate, endMdate, timezone]);
  const [updatingDatetime, setUpdatingDatetime] = useState<{start:MdateTz,end:MdateTz,keepduration:boolean}>(defaultUpdatingDatetime);

  const updateTime = useMemo(()=>function({start,end}:{start?:MdateTz,end?:MdateTz}){
    const duration = updatingDatetime.end.unix - updatingDatetime.start.unix
    let newStart = start ? start : updatingDatetime.start
    let newEnd = end ? end : updatingDatetime.end
    if(!updatingDatetime.keepduration && newStart.unix >= newEnd.unix) return;
    if(updatingDatetime.keepduration){
      if(start) newEnd = newStart.addMs(duration);
      if(end) newStart = newEnd.addMs(-duration);
    }
    setUpdatingDatetime({start:newStart, end:newEnd,keepduration:updatingDatetime.keepduration})
  }, [updatingDatetime, setUpdatingDatetime]);

  const updatedTimeRangeText = useMemo(()=>createTimeRangeText(updatingDatetime.start, updatingDatetime.end), [updatingDatetime]);
  const updatedDurationText = useMemo(()=>createDurationText(updatingDatetime.start, updatingDatetime.end), [updatingDatetime]);

  function cancelEdit(){
    setUpdatingDatetime(defaultUpdatingDatetime);
    setEditing(false);
  };
  function saveEdit(){
    setDuration(updatingDatetime.start, updatingDatetime.end);
    setEditing(false);
  }

  return (
    <>
      { editing && <hr className="h-px my-4 bg-gray-200 border-0"/> }
      <div className="flex w-full mx-2">
        <div className="flex-grow">
          <p className="flex gap-1 text-sm font-normal text-gray-900">{timeRangeText}</p>
          <p className="block text-sm font-normal text-gray-900">{durationText}</p>
        </div>
        <div className="flex-shrink-0">
          {!editing && (
            <button
              onClick={()=>setEditing(true)}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            ><RiPencilLine size={14}/></button>
          )}
        </div>
      </div>

      { editing && (
        <div className="mx-2">
          <div className="flex justify-end">
            <button
              onClick={cancelEdit}
              className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
            ><RiResetLeftFill size={14}/>戻す</button>
          </div>
          <div className="flex">
            <input type="datetime-local"
              className="
                grow
                w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:border-blue-500
              "
              value={updatingDatetime.start.format("YYYY-MM-DDTHH:mm","en")}
              max={!updatingDatetime.keepduration?updatingDatetime.end.forkAdd(-1,'minute').format("YYYY-MM-DDTHH:mm"):""}
              onChange={e=>updateTime({start:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DDTHH:mm",timezone)})}
            />
            <span className="grow-0 my-auto mx-2"> ~ </span>
            <input type="datetime-local" 
              className="
                grow
                w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:border-blue-500
              "
              value={updatingDatetime.end.format("YYYY-MM-DDTHH:mm","en")}
              min={!updatingDatetime.keepduration?updatingDatetime.start.forkAdd(1,'minute').format("YYYY-MM-DDTHH:mm"):""}
              onChange={e=>updateTime({end:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DDTHH:mm",timezone)})}
            />
          </div>
          <div className="mb-1">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked={updatingDatetime.keepduration!} 
                onChange={e=>{
                  setUpdatingDatetime({...updatingDatetime, keepduration:e.currentTarget.checked})
                }}
                className="sr-only peer"
              />
              <div 
                className="
                  relative w-10 h-4 bg-gray-200 ms-1
                  
                  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
                  rounded-full peer
                  peer-checked:after:translate-x-full
                  peer-checked:after:border-white
                  peer-checked:bg-blue-600
                  after:content-['']
                  after:absolute
                  after:top-[2px]
                  after:start-[2px]
                  after:bg-white
                  after:border-gray-300
                  after:border
                  after:rounded-full
                  after:h-3
                  after:w-3
                  after:transition-all 
                "
              ></div>
              <span className="ms-3 text-sm font-medium text-gray-900">Keep Duration</span>
            </label>
          </div>
          {
            ( updatingDatetime.start.unix != startMdate.unix 
              || updatingDatetime.end.unix != endMdate.unix
            ) &&
            <div className="flex w-full items-end">
              <div className="flex-grow">
                <p className="text-xs font-extralight">Editing Times</p>
                <p className="flex gap-1 text-sm font-normal text-gray-900">{updatedTimeRangeText}</p>
                <p className="block text-sm font-normal text-gray-900">{updatedDurationText}</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={saveEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-md"
                  title="保存"
                ><RiCheckLine size={16}/></button>
              </div>
            </div>
          }
        </div>
      )}
    </>
  )
}