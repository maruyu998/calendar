import { useEffect, useMemo, useRef, useState } from 'react';
import Linkify from 'react-linkify';
import { useToast } from 'maruyu-webcommons/react/toast';
import { TimeZone } from '@ymwc/mdate';
import { updateTaskTime, deleteTaskTime, fetchTaskTime, createTaskTime } from '../data/taskTime';
import { CalendarType } from '@client/types/calendar';
import { CaleventIdType, CaleventType } from '@client/types/calevent';
import { createDurationText, createTimeRangeText } from '@addon/client/utils/duration';
import DeleteButton from '@addon/client/components/DeleteButton';
import DuplicateButton from '@addon/client/components/DuplicateButton';
import { ProgressCalendarSchema, ProgressCalendarType } from '../types/calendar';
import {
  convertFetchItemResponseToClient as convertTaskTimeFetchItemResponseToClient,
  TaskTimeWithFullType,
  // convertUpdateItemResponseToClient as convertTaskTimeUpdateItemResponseToClient,
  // convertCreateItemResponseToClient as convertTaskTimeCreateItemResponseToClient,
} from "../types/taskTime";
import { TaskTimeIdType } from '../../share/types/taskTime';
import { UpdateRefreshItemType } from '@client/contexts/EventsProvider';

function TaskTimeEdit({
  caleventId,
  progressCalendar,
  timezone,
  taskTime,
  refreshCaleventByUpdate,
  refreshCaleventByRemove,
  closeModal,
}:{
  caleventId: CaleventIdType,
  progressCalendar: ProgressCalendarType,
  timezone: TimeZone,
  taskTime: TaskTimeWithFullType,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,update:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
  closeModal: ()=>void,
}){
  
  const { addToast } = useToast();

  return (
    <div className="relative mb-8">
      {/* <div className="absolute top-2 right-2 flex">
        <DuplicateButton
          duplicateHandler={()=>{
            createTaskTime({
              calendarId: progressCalendar.id,
              timeQuotaId: timeLog.timeQuota.id,
              startMdate: timeLog.startMdate,
              endMdate: timeLog.endMdate,
              output: "",
              review: "",
            })
            .then(responseObject=>convertTimeLogCreateItemResponseToClient(responseObject, timeQuotaList, timezone))
            .then(timeLog=>{
              refreshCaleventByCreate({
                id: timeLog.id as unknown as CaleventIdType,
                title: createTitle(timeLog.timeQuota),
                startMdate: timeLog.startMdate, 
                endMdate: timeLog.endMdate,
                permissions: ["read", "write", "edit", "delete"],
                style: {
                  mainColor: timeLog.timeQuota.styles.color,
                  isAllDay: false,
                },
                updatedAt: new Date(),
              });
            })
            .catch(e=>{
              addToast("CreateTimeLogError", e.message, "error");
            });
            closeModal();
          }}
        />
        <DeleteButton 
          deleteHandler={()=>{
            deleteTaskTime({ calendarId: timeCalendar.id, id: timeLog.id })
              .catch(error=>addToast("DeleteTimeLogError", error.message, "error"));
            refreshCaleventByRemove(caleventId);
            closeModal();
          }}
        />
      </div> */}
      {/* <div className="mt-2 flex justify-end">
        <label className="inline-flex items-center cursor-pointer">
          <span className="me-2 text-sm font-medium text-gray-900 dark:text-gray-300">Edit</span>
          <input 
            type="checkbox" 
            defaultChecked={isEditing} 
            onChange={e=>setIsEditing(e.currentTarget.checked)}
            className="sr-only peer"
          />
          <div 
            className="
              relative w-9 h-5 bg-gray-200 
              peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
              rounded-full peer 
              peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600
              after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
              after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all 
            "
          ></div>
        </label>
      </div> */}
    </div>
  )
}

export default function CaleventEdit({
  calevent,
  calendar,
  timezone,
  refreshCaleventByUpdate,
  refreshCaleventByRemove,
  closeModal,
}:{
  calevent: CaleventType,
  calendar: CalendarType,
  timezone: TimeZone,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,update:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();
  const [ taskTime, setTaskTime ] = useState<TaskTimeWithFullType|null>(null);
  useEffect(()=>{
    fetchTaskTime({ calendarId: calendar.id, id: calevent.id as unknown as TaskTimeIdType })
    .then(responseObject=>convertTaskTimeFetchItemResponseToClient(responseObject, timezone))
    .then(taskTime=>setTaskTime(taskTime))
    .catch(error=>addToast("FetchTaskFailed", error.message, "error"))
  }, [calevent])

  const progressCalendar = useMemo<ProgressCalendarType|null>(()=>{
    const { success, error, data: progressCalendar } = ProgressCalendarSchema.safeParse(calendar);
    if(!success) {
      console.error("Validation failed:");
      console.dir(error.format(), {depth:null});
      addToast("FetchGcalEventFailed", error.message, "error");
      return null;
    }
    return progressCalendar;
  }, [ calendar ]);
  
  if(progressCalendar == null) return <></>;
  if(taskTime == null) return <></>;
  return (
    <TaskTimeEdit 
      caleventId={calevent.id}
      progressCalendar={progressCalendar}
      timezone={timezone}
      taskTime={taskTime}
      refreshCaleventByUpdate={refreshCaleventByUpdate}
      refreshCaleventByRemove={refreshCaleventByRemove}
      closeModal={closeModal}
    />
  );
}