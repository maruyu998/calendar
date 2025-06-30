import { RiCheckLine, RiPencilLine, RiResetLeftFill } from '@remixicon/react';
import { MdateTz, TimeZone, YYYYMMDD, YYYYMMDDSchema } from 'maruyu-webcommons/commons/utils/mdate';
import { useEffect, useMemo, useState } from 'react';
import { createDurationText, createTimeRangeText } from '@addon/client/utils/duration';
import { GoogleCaleventDateType as GCD } from '../../share/types/googleCalevent';
import { convertGoogleCaleventDateToMdate as c } from '../func/googleCalevnt';

function AllDayDurationForm({
  start,
  end,
  setDateDuration
}:{
  start: YYYYMMDD,
  end: YYYYMMDD,
  setDateDuration: (s:YYYYMMDD, e:YYYYMMDD)=>void,
}){
  return (
    <div className="flex gap-2">
      <input type="date" value={start ?? ""} 
        onChange={e=>setDateDuration(YYYYMMDDSchema.parse(e.target.value), end)}/>
      <input type="date" value={end ?? ""} 
        onChange={e=>setDateDuration(start, YYYYMMDDSchema.parse(e.target.value))}/>
    </div>
  )
}

function DateTimeDurationForm({
  startMdate,
  endMdate,
  timezone,
  setDateTimeDuration,
}:{
  startMdate: MdateTz,
  endMdate: MdateTz,
  timezone: TimeZone,
  setDateTimeDuration: (s:MdateTz, e:MdateTz)=>void,
}){
  const defaultUpdating = useMemo(()=>({startMdate, endMdate, keepduration:true}), [startMdate, endMdate, timezone]);
  const [ updatingDatetime, setUpdatingDatetime ] = useState<{
    startMdate:MdateTz, endMdate:MdateTz, keepduration:boolean
  }>(defaultUpdating);
  
  const updateTime = useMemo(()=>function({
    startMdate,
    endMdate
  }:{
    startMdate?:MdateTz,
    endMdate?:MdateTz
  }){
    const duration = updatingDatetime.endMdate.unix - updatingDatetime.startMdate.unix;
    let newStartMdate = startMdate ? startMdate : updatingDatetime.startMdate;
    let newEndMdate = endMdate ? endMdate : updatingDatetime.endMdate;
    if(!updatingDatetime.keepduration && newStartMdate.unix >= newEndMdate.unix) return;
    if(updatingDatetime.keepduration){
      if(startMdate) newEndMdate = newStartMdate.addMs(duration);
      if(endMdate) newStartMdate = newEndMdate.addMs(-duration);
    }
    setUpdatingDatetime({
      startMdate: newStartMdate, 
      endMdate: newEndMdate,
      keepduration: updatingDatetime.keepduration
    })
  }, [updatingDatetime]);

  return (
    <div>
      <div className="flex">
        <input type="datetime-local"
          className="grow w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:border-blue-500"
          value={updatingDatetime.startMdate.format("YYYY-MM-DDTHH:mm","en")}
          max={!updatingDatetime.keepduration?updatingDatetime.endMdate.forkAdd(-1,'minute').format("YYYY-MM-DDTHH:mm"):""}
          onChange={e=>updateTime({startMdate:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DDTHH:mm",timezone)})}
        />
        <span className="grow-0 my-auto mx-2"> ~ </span>
        <input type="datetime-local" 
          className="grow w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:border-blue-500"
          value={updatingDatetime.endMdate.format("YYYY-MM-DDTHH:mm","en")}
          min={!updatingDatetime.keepduration?updatingDatetime.startMdate.forkAdd(1,'minute').format("YYYY-MM-DDTHH:mm"):""}
          onChange={e=>updateTime({endMdate:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DDTHH:mm",timezone)})}
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
    </div>
  )
}


export default function DurationForm({
  start,
  end,
  timezone,
  setDuration,
}:{
  start: GCD,
  end: GCD,
  timezone: TimeZone,
  setDuration: (start:GCD,end:GCD)=>void,
}){
  const [ editing, setEditing ] = useState<boolean>(false);
  useEffect(()=>{ setEditing(false) }, [start, end]);
  const [ allDayMode, setAllDayMode ] = useState<boolean>(false)
  function isAllDay(eventDate: GCD): boolean {
    return !!eventDate.date && !eventDate.dateTime;
  }
  useEffect(()=>{
    setAllDayMode(isAllDay(start) && isAllDay(end))    
  }, [start, end])

  function genTimeRangeText(start:GCD, end:GCD){
    if(start.date && end.date) return `${start.date} ~ ${end.date}`;
    const startMdate = c(start, timezone);
    const endMdate = c(end, timezone);
    if(startMdate && endMdate) return createTimeRangeText(startMdate, endMdate);
    console.log({ start, end });
    return "unknown";
  }
  function genDurationText(start:GCD, end:GCD, timezone:TimeZone){
    if(start.date && end.date) {
      return createDurationText(
        MdateTz.parseFormat(start.date, "YYYY-MM-DD", timezone), 
        MdateTz.parseFormat(end.date, "YYYY-MM-DD", timezone))
    }
    const startMdate = c(start, timezone);
    const endMdate = c(end, timezone);
    if(startMdate && endMdate) return createDurationText(startMdate, endMdate);
    console.log({ start, end });
    return "unknown";
  }

  const defaultUpdating = useMemo(()=>({start, end}), [start, end, timezone]);
  const [ updatingDatetime, setUpdatingDatetime ] = useState<{start:GCD,end:GCD
  }>(defaultUpdating);

  // 変更検知
  const hasChanges = useMemo(() => {
    return JSON.stringify(updatingDatetime.start) !== JSON.stringify(start) ||
           JSON.stringify(updatingDatetime.end) !== JSON.stringify(end);
  }, [updatingDatetime, start, end]);

  function cancelEdit(){
    setUpdatingDatetime(defaultUpdating);
    setEditing(false);
  };
  function saveEdit(){
    setDuration(updatingDatetime.start, updatingDatetime.end);
    setEditing(false);
  }

  return (
    <>
      { editing && <hr className="h-px my-4 bg-gray-200 border-0"/> }
      <div className="flex w-full">
        <div className="flex-grow">
          <p className="flex gap-1 text-sm font-normal text-gray-900">{genTimeRangeText(start, end)}</p>
          <p className="block text-sm font-normal text-gray-900">{genDurationText(start, end, timezone)}</p>
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
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => {
                const newAllDayMode = !allDayMode;
                setAllDayMode(newAllDayMode);
                
                if (newAllDayMode) {
                  // 時刻指定 → 全日に変更
                  try {
                    const startMdate = c(updatingDatetime.start, timezone);
                    const endMdate = c(updatingDatetime.end, timezone);
                    setUpdatingDatetime({
                      start: { date: startMdate.format("YYYY-MM-DD") as YYYYMMDD },
                      end: { date: endMdate.format("YYYY-MM-DD") as YYYYMMDD }
                    });
                  } catch (error) {
                    console.warn('Error converting to all-day:', error);
                  }
                } else {
                  // 全日 → 時刻指定に変更
                  try {
                    const startMdate = updatingDatetime.start.date 
                      ? MdateTz.parseFormat(updatingDatetime.start.date, "YYYY-MM-DD", timezone)
                      : new MdateTz(Date.now(), timezone);
                    const endMdate = startMdate.forkAdd(1, 'hour');
                    setUpdatingDatetime({
                      start: { dateTime: startMdate.toIsoString(), timeZone: timezone },
                      end: { dateTime: endMdate.toIsoString(), timeZone: timezone }
                    });
                  } catch (error) {
                    console.warn('Error converting to timed event:', error);
                  }
                }
              }}
              className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-50 flex items-center gap-1"
            >
              {allDayMode ? "時刻指定に変更" : "全日に変更"}
            </button>
            <button
              onClick={cancelEdit}
              className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
            ><RiResetLeftFill size={14}/>戻す</button>
          </div>
          {
            !allDayMode ? (
              <DateTimeDurationForm 
                startMdate={c(updatingDatetime.start, timezone)}
                endMdate={c(updatingDatetime.end, timezone)}
                timezone={timezone}
                setDateTimeDuration={(s:MdateTz,e:MdateTz)=>{
                  setUpdatingDatetime({
                    start: { dateTime: s.toIsoString(), timeZone: timezone },
                    end: { dateTime: e.toIsoString(), timeZone: timezone },
                  })
                }}
              /> 
            ) : (
              <AllDayDurationForm 
                start={updatingDatetime.start.date ?? new MdateTz(Date.now(), timezone).format("YYYY-MM-DD") as YYYYMMDD}
                end={updatingDatetime.end.date ?? new MdateTz(Date.now(), timezone).format("YYYY-MM-DD") as YYYYMMDD}
                setDateDuration={(s:YYYYMMDD, e:YYYYMMDD)=>{
                  setUpdatingDatetime({ start: { date: s }, end: { date: e } })
                }}
              />
            )
          }
          {hasChanges && (
            <div className="flex w-full items-end mt-3 pt-3 border-t border-gray-200">
              <div className="flex-grow">
                <p className="text-xs text-blue-600">変更があります</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={saveEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 text-sm shadow-sm flex items-center gap-1"
                  title="変更を保存"
                >
                  <RiCheckLine size={14}/>
                  保存
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}