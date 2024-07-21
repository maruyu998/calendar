import { useMemo, useRef, useState } from 'react';
import Linkify from 'react-linkify';
import { CaleventClientType } from 'mtypes/v2/Calevent';
import { updateCalevent, deleteCalevent } from '../../data/calevent';
import { DAY, HOUR, MINUTE } from 'maruyu-webcommons/commons/utils/time';
import { MdateTz } from 'maruyu-webcommons/commons/utils/mdate';
import { useSetting } from '../../contexts/SettingProvider';
import { useEvents } from '../../contexts/EventsProvider';
import { useStatus } from '../../contexts/StatusProvider';
import { useTop } from '../../contexts/TopProvider';
import { convertClientCalevent } from '../../utils/calevent';

export default function CaleventEdit({
  calevent, 
  closeModal
}:{
  calevent: CaleventClientType,
  closeModal
}){
  const { addAlert } = useTop();
  const { timezone } = useSetting();
  const { refreshCaleventByUpdate, refreshCaleventByRemove } = useEvents();
  const { calendarList } = useStatus();
  const [ isEditing, setIsEditing ] = useState<boolean>(false);

  const defaultUpdatingDatetime = useMemo(()=>({start:calevent.startMdate, end:calevent.endMdate, keepduration:true}), [calevent]);
  const [updatingDatetime, setUpdatingDatetime] = useState<{start:MdateTz,end:MdateTz,keepduration:boolean}>(defaultUpdatingDatetime);
  const [isDateEvent, setIsDateEvent] = useState<boolean>(calevent.style.isAllDay);
  const [updateTitle, setUpdateTitle] = useState<string>(calevent.title);
  const updateTitleInputRef = useRef<HTMLInputElement|null>(null);

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

  const calcDurationString = useMemo(()=>function(){
    let milliseconds = calevent.endMdate.unix - calevent.startMdate.unix;
    const days = Math.floor(milliseconds / DAY);
    milliseconds -= DAY * days;
    const hours = Math.floor(milliseconds / HOUR);
    milliseconds -= HOUR * hours;
    const minutes = Math.ceil(milliseconds / MINUTE);
    const texts = new Array<string>();
    if(days > 0) texts.push(`${days} ${days === 1 ? "day" : "days"}`)
    if(hours > 0) texts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`)
    if(minutes > 0) texts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`)
    return texts.join(", ")
  }, [calevent]);

  const durationString = useMemo(()=>{
    const start = calevent.startMdate.toTz(timezone).format("MM/DD(ddd) HH:mm","en");
    const startDateText = calevent.startMdate.toTz(timezone).format("MM/DD");
    const endDateText = calevent.endMdate.toTz(timezone).format("MM/DD");
    const format = (startDateText == endDateText) ? "HH:mm" : "MM/DD(ddd) HH:mm";
    const end = calevent.endMdate.toTz(timezone).format(format,"en");
    return `${start} ~ ${end}`;
  }, [calevent, timezone]);

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
        !isEditing && 
        <div>
          <p className="block mb-1 text-md font-medium text-gray-900">{calevent.title}</p>
          <p className="block text-sm font-medium text-gray-900">{calevent.calendar.name}</p>
          <div className="flex gap-1 block text-sm font-normal text-gray-900">{durationString}</div>
          <p className="block text-sm font-normal text-gray-900">{calcDurationString()}</p>
        </div>
      }
      {
        isEditing && 
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
                defaultValue={calevent.title}
                placeholder={calevent.title} 
                required={true}
                ref={updateTitleInputRef}
              />
              {
                calevent.title != updateTitle &&
                <button
                  className="
                    text-white absolute end-2 bottom-1 bg-blue-700 hover:bg-blue-800 
                    focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-medium rounded-lg text-sm px-2 py-1.5
                  "
                  onClick={()=>{
                    if(updateTitleInputRef.current == null) return;
                    updateTitleInputRef.current.value = calevent.title
                    setUpdateTitle(calevent.title)
                  }}
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
          <div className="mb-1">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked={calevent.style.isAllDay} 
                onChange={e=>setIsDateEvent(e.currentTarget.checked)}
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
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Is date event</span>
            </label>
          </div>
        </div>
      }
      <div>
        {
          !isEditing && calevent.description &&
          <>
            <hr className="h-px my-4 bg-gray-200 border-0"/>
            <label className="block mb-1 text-sm font-medium text-gray-900">Description</label>
            <Linkify 
              componentDecorator={(decoratedHref, decoratedText, key)=>(
                <a target="blank" href={decoratedHref} key={key}
                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                >{decoratedText}</a>
              )}
            >
              <p className="block text-sm font-normal text-gray-900 whitespace-pre-wrap">{calevent.description}</p>
            </Linkify>
          </>
        }

        {
          isEditing &&
          <>
            <label className="block mb-1 text-sm font-medium text-gray-900">Description</label>
            <textarea rows={6} 
              className="
                block p-2.5 w-full text-sm text-gray-900 bg-gray-50 
                rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
              "
              defaultValue={calevent.description}
              placeholder={calevent.description}
            ></textarea>
          </>
        }
        {
          calevent.calendarSource == "calendar.google.com" &&
          <>
            <hr className="h-px my-4 bg-gray-200 border-0"/>
            <button type="button" 
              className="
                text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 
                hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2
              "
              onClick={()=>{window.open(calevent.data.url, '_blank');closeModal()}}
            >GCalendar</button>
          </>
        }
        {
          calevent.calendarSource == "health.maruyu.work" && 
          <>
            <hr className="h-px my-4 bg-gray-200 border-0"/>
            { 
              calevent.data.externals.map(({url, name})=>(
                <button type="button" 
                  className="
                    text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 
                    hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 
                    font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2
                  "
                  key={url}
                  onClick={()=>{window.open(url, '_blank');closeModal()}}
                >{name}</button>
              ))
            }
          </>
        }
      </div>
      
      {
        isEditing && 
        <>
          <hr className="h-px my-4 bg-gray-200 border-0"/>
          <div className="mb-1">
            <p className="block text-sm font-normal text-gray-900">eventId</p>
            <p className="block text-sm font-normal text-gray-900">{calevent.id}</p>
          </div>
          <div className="mb-1">
            <p className="block text-sm font-normal text-gray-900">calendarId</p>
            <p className="block text-sm font-normal text-gray-900">{calevent.calendarId}</p>
          </div>
          { calevent.calendarSource == "calendar.google.com" && (
            <>
              <div className="mb-1">
                <p className="block text-sm font-normal text-gray-900">googlecalendarEventId</p>
                <p className="block text-sm font-normal text-gray-900">{calevent.data.eventId}</p>
              </div>
              <div className="mb-1">
                <p className="block text-sm font-normal text-gray-900">googlecalendarCalendarId</p>
                <p className="block text-sm font-normal text-gray-900">{calevent.data.calendarId}</p>
              </div>
            </>
          )}
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
                  deleteCalevent({
                    caleventId: calevent.id, 
                    calendarId: calevent.calendarId
                  })
                  .then(calevent=>{
                    refreshCaleventByRemove(convertClientCalevent(calevent,timezone,calendarList));
                  })
                  .catch(error=>{
                    addAlert("DeleteEventError", error.message);
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
                if(updatingDatetime.start.unix >= updatingDatetime.end.unix) return addAlert("InputError", "start >= end");
                updateCalevent({
                  caleventId: calevent.id,
                  calendarId: calevent.calendarId,
                  title: calevent.title != updateTitle ? updateTitle : undefined, 
                  startMdate: updatingDatetime.start,
                  endMdate: updatingDatetime.end,
                  // is_date_event: isDateEvent
                }).then(calevent=>{
                  refreshCaleventByUpdate(convertClientCalevent(calevent,timezone,calendarList));
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