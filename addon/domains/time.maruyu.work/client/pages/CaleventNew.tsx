import { useEffect, useMemo, useRef, useState } from 'react';
import { MdateTz, TimeZone } from '@ymwc/mdate';
import { useToast } from '@ymwc/react-core';
import { convertFetchListResponseToClient as convertFetchQuotaListResponseToClient } from "../types/quota";
import { fetchQuotaList } from "../data/quota";
import { CalendarType } from "@client/types/calendar";
import { CaleventIdType, CaleventType } from '@client/types/calevent';
import { createLog } from '../data/log';
import { convertCreateItemResponseToClient, LogType } from "../types/log";
import { TimeCalendarSchema, TimeCalendarType } from '../types/calendar';
import { createTitle } from '../../share/func/log';
import QuotaForm from '../components/QuotaForm';
import DurationForm from '../components/DurationForm';
import OutputForm from '../components/OutputForm';
import ReviewForm from '../components/ReviewForm';
import { QuotaType } from '../../share/types/quota';

function LogNew({
  clickedDate,
  timezone,
  timeCalendar,
  quotaList,
  refreshCaleventByCreate,
  closeModal,
}:{
  clickedDate: MdateTz,
  timezone: TimeZone,
  timeCalendar: TimeCalendarType,
  quotaList: QuotaType[],
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();

  const [ startMdate, setStartMdate ] = useState<MdateTz>(clickedDate);
  const [ endMdate, setEndMdate ] = useState<MdateTz>(clickedDate.forkAdd(15,'minute'));

  // const startTimeRef = useRef<HTMLInputElement|null>(null);
  // const endTimeRef = useRef<HTMLInputElement|null>(null);
  // const updateTime = useMemo(()=>function({start,end}:{start?:MdateTz,end?:MdateTz}){
  //   const duration = endMdate.unix - startMdate.unix
  //   let newStart = start ? start : startMdate
  //   let newEnd = end ? end : endMdate
  //   if(!keepduration && newStart.unix >= newEnd.unix) return;
  //   if(keepduration){
  //     if(start) newEnd = newStart.forkAdd(duration,'millisecond');
  //     if(end) newStart = newEnd.forkAdd(-duration, 'millisecond');
  //   }
  //   setStartMdate(newStart);
  //   setEndMdate(newEnd);
  // }, [startMdate, endMdate, keepduration]);
  // useEffect(()=>{
  //   if(startTimeRef.current) startTimeRef.current.value = startMdate.format("YYYY-MM-DDTHH:mm");
  // }, [startMdate])
  // useEffect(()=>{
  //   if(endTimeRef.current) endTimeRef.current.value = endMdate.format("YYYY-MM-DDTHH:mm");
  // }, [endMdate])
  
  const [ quota, setQuota ] = useState<QuotaType|null>(null);
  const [ output, setOutput ] = useState<string>("");
  const [ review, setReview ] = useState<string>("");
  
  return (
    <div className="mb-8">
      <p className="text-xs text-gray-700 mb-2">{timeCalendar.calendarSource}</p>
      <QuotaForm
        quotaList={quotaList}
        quota={quota}
        setQuota={(quota:QuotaType)=>{ setQuota(quota) }}
      />
      <DurationForm 
        startMdate={startMdate}
        endMdate={endMdate}
        timezone={timezone}
        setDuration={(startMdate:MdateTz,endMdate:MdateTz)=>{
          if(startMdate.unix == startMdate.unix && endMdate.unix == endMdate.unix) return;
          if(startMdate.unix >= endMdate.unix) return addToast("InputError", "start >= end", "warning");
          setStartMdate(startMdate);
          setEndMdate(endMdate);
        }}
      />
      <hr className="h-px my-4 bg-gray-200 border-0"/>
      <OutputForm
        output={output} 
        setOutput={output=>{ setOutput(output) }}
      />
      <hr className="h-px my-4 bg-gray-200 border-0"/>
      <ReviewForm
        review={review} 
        setReview={review=>{ setReview(review) }}
      />
{/* 
    <div className="mb-3">
      <label className="block mb-1 text-sm font-medium text-gray-900">DataTime Range</label>
      <div className="flex">
        <input type="datetime-local"
          ref={startTimeRef}
          max={keepduration?endMdate.forkAdd(-1,'minute').format("YYYY-MM-DDTHH:mm"):""}
          onChange={e=>updateTime({start:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DD HH:mm",timezone)})}
        />
        <input type="datetime-local"
          ref={endTimeRef}
          min={keepduration?startMdate.forkAdd(1,'minute').format("YYYY-MM-DDTHH:mm"):""}
          onChange={e=>updateTime({end:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DD HH:mm",timezone)})}
        />
      </div>
    </div>
*/}
      <div className="mt-5 flex justify-end gap-2">
        {
          quota && startMdate && endMdate &&
          <button 
            type="button" 
            className="
              rounded-full border border-gray-300 py-2 px-4 text-center text-sm transition-all shadow-sm
              text-gray-600 bg-red-300
              hover:shadow-lg hover:text-white hover:bg-red-600 hover:border-gray-800
            "
            onClick={e=>{
              if(startMdate.unix >= endMdate.unix) return addToast("InputError", "startMdate >= endMdate", "warning");
              if(quota == null) return addToast("InputError", "quota is not set", "warning");
              createLog({
                calendarId: timeCalendar.id,
                quotaId: quota.id,
                startTime: startMdate.toDate(),
                endTime: endMdate.toDate(),
                output,
                review,
              })
              .then(responseObject=>convertCreateItemResponseToClient(responseObject, quotaList, timezone))
              .then(log=>{
                refreshCaleventByCreate({
                  id: log.id as unknown as CaleventIdType,
                  calendarId: timeCalendar.id,
                  title: createTitle(log.quota), 
                  startMdate: log.startMdate, 
                  endMdate: log.endMdate,
                  permissions: ["read", "write", "edit", "delete"],
                  style: {
                    mainColor: log.quota.styles.color,
                    isAllDay: false,
                  },
                  updatedAt: new Date(),
                });
              })
              .catch(e=>{
                addToast("CreateLogError", e.message, "error");
              });
              closeModal();
            }}
          >Create</button>
        }
      </div>
    </div>
  )
}

export default function CaleventNew({
  clickedDate,
  timezone,
  calendar,
  refreshCaleventByCreate,
  closeModal,
}:{
  clickedDate: MdateTz,
  timezone: TimeZone,
  calendar: CalendarType,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();

  const timeCalendar = useMemo<TimeCalendarType|null>(()=>{
    const { success, error, data: timeCalendar } = TimeCalendarSchema.safeParse(calendar);
    if(!success) {
      console.error("Validation failed:");
      console.dir(error.format(), {depth:null});
      addToast("FetchGcalEventFailed", error.message, "error");
      return null;
    }
    return timeCalendar;
  }, [ calendar ]);

  const [quotaList, setQuotaList] = useState<QuotaType[]|null>(null);
  useEffect(()=>{ 
    if(timeCalendar === null) return;
    fetchQuotaList({ calendarId: timeCalendar.id })
    .then(responseObject=>convertFetchQuotaListResponseToClient(responseObject))
    .then(quotaList=>{
      console.log({quotaList});
      return quotaList;
    })
    .then(quotaList=>setQuotaList(quotaList))
    .catch(error => addToast("FetchError", error.message, "error"))
  }, [timeCalendar]);

  if(timeCalendar == null) return <></>;
  if(quotaList == null) return <></>;
  return (
    <LogNew 
      clickedDate={clickedDate}
      timezone={timezone}
      timeCalendar={timeCalendar}
      quotaList={quotaList}
      refreshCaleventByCreate={refreshCaleventByCreate}
      closeModal={closeModal}
    />
  )
}