import { useEffect, useMemo, useRef, useState } from 'react';
import Linkify from 'react-linkify';
import { updateActivity, deleteActivity, fetchActivity } from '../data/activity';
import { DAY, HOUR, MINUTE } from 'maruyu-webcommons/commons/utils/time';
import { MdateTz, TimeZone } from 'maruyu-webcommons/commons/utils/mdate';
import { useToast } from 'maruyu-webcommons/react/toast';
import { PeopleCalendarSchema, PeopleCalendarType } from '../types/calendar';
import { ActivityType } from '../types/activity';
import { CalendarType } from '@client/types/calendar';
import { CaleventIdType, CaleventType } from '@client/types/calevent';
import {
  convertFetchItemResponseToClient
} from "../types/activity";
import { ActivityIdType } from '../../share/types/activity';
import CaleventCommonView from '@addon/client/components/CaleventCommonView';
import { createDurationText, createTimeRangeText } from '../../../../client/utils/duration';
import { UpdateRefreshItemType } from '@client/contexts/EventsProvider';

function ActivityEdit({
  caleventId,
  peopleCalendar,
  timezone,
  activity,
  refreshCaleventByUpdate,
  refreshCaleventByRemove,
  closeModal,
}:{
  caleventId: CaleventIdType,
  peopleCalendar: PeopleCalendarType,
  timezone: TimeZone,
  activity: ActivityType,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,update:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();
  const [ isEditing, setIsEditing ] = useState<boolean>(false);

  const defaultUpdatingDatetime = useMemo(()=>({start:activity.startMdate, end:activity.endMdate, keepduration:true}), [activity]);
  const [updatingDatetime, setUpdatingDatetime] = useState<{start:MdateTz,end:MdateTz,keepduration:boolean}>(defaultUpdatingDatetime);
  const [updateTitle, setUpdateTitle] = useState<string|undefined>(activity.title);
  const [updateMemo, setUpdateMemo] = useState<string|undefined>(activity.memo);

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

  const durationText = useMemo(()=>createDurationText(activity.startMdate, activity.endMdate), [activity, timezone]);
  const timeRangeText = useMemo(()=>createTimeRangeText(activity.startMdate, activity.endMdate), [activity, timezone]);

  return (
    <div>
      <div className="mt-2 flex justify-end">
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
      </div>
      {
        !isEditing ? (
          <div>
            <p className="block mb-1 text-md font-medium text-gray-900">{activity.title}</p>
            <p className="block text-sm font-medium text-gray-900">{peopleCalendar.name}</p>
            <p className="flex gap-1 text-sm font-normal text-gray-900">{timeRangeText}</p>
            <p className="block text-sm font-normal text-gray-900">{durationText}</p>
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium text-gray-900">Title</label>
              <div className="relative">
                <input 
                  className="
                    block w-full p-2.5 text-sm text-gray-900 border border-gray-300 
                    rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500
                  " 
                  onChange={e=>setUpdateTitle(e.currentTarget.value)}
                  defaultValue={activity.title}
                  placeholder={activity.title} 
                  required={true}
                />
                {
                  activity.title != updateTitle &&
                  <button
                    className="
                      text-white absolute end-2 bottom-1 bg-blue-700 hover:bg-blue-800 
                      focus:ring-4 focus:outline-none focus:ring-blue-300 
                      font-medium rounded-lg text-sm px-2 py-1.5
                    "
                    onClick={()=>{ setUpdateTitle(activity.title) }}
                  >Reset</button>
                }
              </div>
            </div>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium text-gray-900">DataTime Range</label>
              <div className="flex">
                <input type="datetime-local"
                  className="
                    grow
                    block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm 
                    focus:ring-blue-500 focus:border-blue-500
                  "
                  value={updatingDatetime.start.format("YYYY-MM-DDTHH:mm","en")}
                  max={!updatingDatetime.keepduration?updatingDatetime.end.forkAdd(-1,'minute').format("YYYY-MM-DDTHH:mm"):""}
                  onChange={e=>updateTime({start:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DDTHH:mm",timezone)})}
                />
                <span className="grow-0 my-auto mx-2"> ~ </span>
                <input type="datetime-local" 
                  className="
                    grow
                    block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm 
                    focus:ring-blue-500 focus:border-blue-500
                  "
                  value={updatingDatetime.end.format("YYYY-MM-DDTHH:mm","en")}
                  min={!updatingDatetime.keepduration?updatingDatetime.start.forkAdd(1,'minute').format("YYYY-MM-DDTHH:mm"):""}
                  onChange={e=>updateTime({end:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DDTHH:mm",timezone)})}
                />
              </div>
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
                    relative w-9 h-5 bg-gray-200 
                    peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                    rounded-full peer 
                    peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600
                    after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all 
                  "
                ></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Keep Duration</span>
              </label>
            </div>
          </div>
        )
      }
      <div>
        {
          !isEditing && activity.memo &&
          <>
            <hr className="h-px my-4 bg-gray-200 border-0"/>
            <label className="block mb-1 text-sm font-medium text-gray-900">Memo</label>
            <Linkify 
              componentDecorator={(decoratedHref, decoratedText, key)=>(
                <a target="blank" href={decoratedHref} key={key}
                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                >{decoratedText}</a>
              )}
            >
              <p className="block text-sm font-normal text-gray-900 whitespace-pre-wrap">{activity.memo}</p>
            </Linkify>
          </>
        }

        {
          isEditing &&
          <>
            <label className="block mb-1 text-sm font-medium text-gray-900">Memo</label>
            <textarea
              className="
                block p-2.5 w-full text-sm text-gray-900 bg-gray-50 
                rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
              "
              defaultValue={activity.memo}
              placeholder={activity.memo}
              onChange={e=>setUpdateMemo(e.currentTarget.value)}
            ></textarea>
          </>
        }
      </div>
      
      {
        isEditing && 
        <>
          <hr className="h-px my-4 bg-gray-200 border-0"/>
          <div className="mb-1">
            <p className="block text-sm font-normal text-gray-900">eventId</p>
            <p className="block text-sm font-normal text-gray-900">{activity.id}</p>
          </div>
          <hr className="h-px my-4 bg-gray-200 border-0"/>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" 
              className="
                text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 
                hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center
              "
              onClick={()=>{
                if(window.confirm("Are you really delete this event?")){ 
                  deleteActivity({ calendarId: peopleCalendar.id, id: activity.id })
                  .then(responseObject=>{
                    refreshCaleventByRemove(caleventId);
                  })
                  .catch(error=>{
                    addToast("DeleteActivityError", error.message, "error");
                  })
                  closeModal();
                }
              }}
            >Delete Event</button>
            <button type="button" 
              className="
                text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 
                hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center
              "
              onClick={()=>{
                if(updatingDatetime.start.unix >= updatingDatetime.end.unix) return addToast("InputError", "start >= end", "warning");
                updateActivity({
                  calendarId: peopleCalendar.id,
                  id: activity.id,
                  title: activity.title != updateTitle ? updateTitle : undefined,
                  memo: activity.memo != updateMemo ? updateMemo : undefined,
                  startTime: updatingDatetime.start.toDate(),
                  endTime: updatingDatetime.end.toDate(),
                }).then(responseObject=>{
                  refreshCaleventByUpdate(caleventId, {});
                })
                .catch(e=>{window.alert(e)});
                closeModal();
              }}
            >Save Changes</button>
          </div>
        </>
      }
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
  const [ activity, setActivity ] = useState<ActivityType|null>(null);
  useEffect(()=>{
    fetchActivity({ calendarId: calendar.id, id: calevent.id as unknown as ActivityIdType })
    .then(responseObject=>convertFetchItemResponseToClient(responseObject, timezone))
    .then(activity=>{
      setActivity(activity);
    })
    .catch(error=>{
      addToast("FetchActivityFailed", error.message, "error");
    })
  }, [calevent])

  const peopleCalendar = useMemo<PeopleCalendarType|null>(()=>{
    const { success, error, data: peopleCalendar } = PeopleCalendarSchema.safeParse(calendar);
    if(!success) {
      console.error("Validation failed:");
      console.dir(error.format(), {depth:null});
      addToast("FetchGcalEventFailed", error.message, "error");
      return null;
    }
    return peopleCalendar;
  }, [ calendar ]);
  
  if(peopleCalendar == null || activity == null) return (
    <CaleventCommonView calevent={calevent} calendar={calendar} timezone={timezone} loading={true}/>
  );
  return (
    <ActivityEdit 
      caleventId={calevent.id}
      peopleCalendar={peopleCalendar}
      timezone={timezone}
      activity={activity} 
      refreshCaleventByUpdate={refreshCaleventByUpdate}
      refreshCaleventByRemove={refreshCaleventByRemove}
      closeModal={closeModal}
    />
  );
}