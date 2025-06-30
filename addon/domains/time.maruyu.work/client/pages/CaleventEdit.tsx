import { useEffect, useMemo, useRef, useState } from 'react';
import { updateLog, deleteLog, createLog } from '../data/log';
import { MdateTz, TimeZone } from 'maruyu-webcommons/commons/utils/mdate';
import { useToast } from 'maruyu-webcommons/react/toast';
import { CalendarType } from "@client/types/calendar";
import { CaleventIdType, CaleventType } from "@client/types/calevent";
import { TimeCalendarSchema, TimeCalendarType } from '../types/calendar';
import { 
  LogType,
  convertFetchItemResponseToClient as convertLogFetchItemResponseToClient,
  convertUpdateItemResponseToClient as convertLogUpdateItemResponseToClient,
  convertCreateItemResponseToClient as convertLogCreateItemResponseToClient,
} from "../types/log";
import { fetchLog } from '../data/log';
import { createTitle } from "../../share/func/log";
import { fetchQuotaList } from '../data/quota';
import { convertFetchListResponseToClient as convertFetchQuotaListResponseToClient } from "../types/quota";
import CaleventCommonView from '@addon/client/components/CaleventCommonView';
import DeleteButton from '@addon/client/components/DeleteButton';
import DuplicateButton from '@addon/client/components/DuplicateButton';
import OutputForm from '../components/OutputForm';
import ReviewForm from '../components/ReviewForm';
import QuotaForm from '../components/QuotaForm';
import DurationForm from '../components/DurationForm';
import { UpdateRefreshItemType } from '@client/contexts/EventsProvider';
import { QuotaType } from '../../share/types/quota';
import { LogIdType } from '../../share/types/log';

function LogEdit({
  caleventId,
  timeCalendar,
  timezone,
  log,
  setLog,
  quotaList,
  refreshCaleventByCreate,
  refreshCaleventByUpdate,
  refreshCaleventByRemove,
  closeModal,
}:{
  caleventId: CaleventIdType,
  timeCalendar: TimeCalendarType,
  timezone: TimeZone,
  log: LogType,
  setLog: (log:LogType)=>void,
  quotaList: QuotaType[],
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,update:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();

  return (
    <div className="relative mb-8">
      <div className="absolute top-2 right-2 flex">
        <DuplicateButton
          duplicateHandler={()=>{
            createLog({
              calendarId: timeCalendar.id,
              quotaId: log.quota.id,
              startTime: log.startMdate.toDate(),
              endTime: log.endMdate.toDate(),
              output: "",
              review: "",
            })
            .then(responseObject=>convertLogCreateItemResponseToClient(responseObject, quotaList, timezone))
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
        />
        <DeleteButton 
          deleteHandler={()=>{
            deleteLog({ calendarId: timeCalendar.id, id: log.id })
              .catch(error=>addToast("DeleteLogError", error.message, "error"));
            refreshCaleventByRemove(caleventId);
            closeModal();
          }}
        />
      </div>
      <p className="text-gray-700">Calendar: {timeCalendar.name}</p>
      <p className="text-xs text-gray-700 mb-2">{timeCalendar.calendarSource}</p>
      <QuotaForm
        quotaList={quotaList}
        quota={log.quota}
        setQuota={(quota:QuotaType)=>{
          if(quota.id == log.quota.id) return;
          updateLog({ calendarId: timeCalendar.id, id: log.id, quotaId: quota.id })
            .then(responseObject=>convertLogUpdateItemResponseToClient(responseObject, quotaList, timezone))
            .then(log=>{
              setLog(log);
              refreshCaleventByUpdate(caleventId, { title: createTitle(log.quota)});
            })
            .catch(error=>addToast("UpdateLogError", error.message, "error"));
        }}
      />
      <DurationForm 
        startMdate={log.startMdate}
        endMdate={log.endMdate}
        timezone={timezone}
        setDuration={(startMdate:MdateTz,endMdate:MdateTz)=>{
          if(log.startMdate.unix == startMdate.unix && log.endMdate.unix == endMdate.unix) return;
          if(startMdate.unix >= endMdate.unix) return addToast("InputError", "start >= end", "warning");
          updateLog({ calendarId: timeCalendar.id, id: log.id, startTime: startMdate.toDate(), endTime: endMdate.toDate() })
            .then(responseObject=>convertLogUpdateItemResponseToClient(responseObject, quotaList, timezone))
            .then(log=>{
              setLog(log);
              refreshCaleventByUpdate(caleventId, {startMdate:log.startMdate, endMdate:log.endMdate});
            })
            .catch(error=>addToast("UpdateLogError", error.message, "error"));
        }}
      />
      <hr className="h-px my-4 bg-gray-200 border-0"/>
      <OutputForm
        output={log.output} 
        setOutput={output=>{
          if(output == log.output) return;
          updateLog({ calendarId: timeCalendar.id, id: log.id, output })
            .then(responseObject=>convertLogUpdateItemResponseToClient(responseObject, quotaList, timezone))
            .then(log=>setLog(log))
            .catch(error=>addToast("UpdateLogError", error.message, "error"));
        }}
      />
      <hr className="h-px my-4 bg-gray-200 border-0"/>
      <ReviewForm
        review={log.review} 
        setReview={review=>{
          if(review == log.review) return;
          updateLog({ calendarId: timeCalendar.id, id: log.id, review })
            .then(responseObject=>convertLogUpdateItemResponseToClient(responseObject, quotaList, timezone))
            .then(log=>setLog(log))
            .catch(error=>addToast("UpdateLogError", error.message, "error"));
        }}
      />
      {
        // <div className="mb-1">
        //   <p className="text-sm font-normal text-gray-900">eventId</p>
        //   <p className="text-sm font-normal text-gray-900">{timeLog.id}</p>
        // </div>
        // <div className="mb-1">
        //   <p className="text-sm font-normal text-gray-900">calendarId</p>
        //   <p className="text-sm font-normal text-gray-900">{timeLog.calendarId}</p>
        // </div>
      }
    </div>
  )
}


export default function CaleventEdit({
  calevent,
  calendar,
  timezone,
  refreshCaleventByCreate,
  refreshCaleventByUpdate,
  refreshCaleventByRemove,
  closeModal
}:{
  calevent: CaleventType,
  calendar: CalendarType,
  timezone: TimeZone,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,update:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
  closeModal: ()=>void,
}){

  const { addToast } = useToast();
  const [ log, setLog ] = useState<LogType|null>(null);

  const [quotaList, setQuotaList] = useState<QuotaType[]|null>(null);

  useEffect(()=>{
    if(quotaList == null) return;
    fetchLog({ calendarId: calendar.id, id: calevent.id as unknown as LogIdType })
    .then(responseObject=>convertLogFetchItemResponseToClient(responseObject, quotaList, timezone))
    .then(log=>setLog(log))
    .catch(error=>{
      addToast("FetchLogFailed", error.message, "error");
    })
  }, [calevent, quotaList]);

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

  if(quotaList == null || log == null || timeCalendar == null) return (
    <CaleventCommonView calevent={calevent} calendar={calendar} timezone={timezone} loading={true}/>
  );
  return (
    <LogEdit 
      caleventId={calevent.id}
      timeCalendar={timeCalendar}
      timezone={timezone}
      log={log}
      setLog={setLog}
      quotaList={quotaList}
      refreshCaleventByCreate={refreshCaleventByCreate}
      refreshCaleventByUpdate={refreshCaleventByUpdate}
      refreshCaleventByRemove={refreshCaleventByRemove}
      closeModal={closeModal}
    />
  );
}