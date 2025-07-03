import { useEffect, useMemo, useRef, useState } from 'react';
import Linkify from 'react-linkify';
import { DAY, HOUR, MINUTE } from '@ymwc/utils';
import { MdateTz, TimeZone } from '@ymwc/mdate';
import { useToast } from 'maruyu-webcommons/react/toast';
import { CaleventIdType, CaleventType } from "@client/types/calevent";
import { CalendarType } from "@client/types/calendar";
import { DefaultCalendarType } from "../types/calendar";
import CaleventCommonView from "@addon/client/components/CaleventCommonView";
import { UpdateRefreshItemType } from '@client/contexts/EventsProvider';

// function DefaultCaleventEdit({
//   caleventId,
//   calendar,
//   timezone,
//   defaultCalevent,
//   refreshCaleventByUpdate,
//   refreshCaleventByRemove,
//   closeModal,
// }:{
//   caleventId: string,
//   calendar: DefaultCalendarType
//   timezone: TimeZone,
//   defaultCalevent: CaleventType,
//   refreshCaleventByUpdate:(caleventId:string,update:UpdateRefreshItemType)=>void,
//   refreshCaleventByRemove:(caleventId:string)=>void,
//   closeModal: ()=>void,
// }){
//   const { addToast } = useToast();
//   const [ isEditing, setIsEditing ] = useState<boolean>(false);

//   const defaultUpdatingDatetime = useMemo(()=>({start:defaultCalevent.startMdate, end:defaultCalevent.endMdate, keepduration:true}), [defaultCalevent]);
//   const [updatingDatetime, setUpdatingDatetime] = useState<{start:MdateTz,end:MdateTz,keepduration:boolean}>(defaultUpdatingDatetime);
//   const [isDateEvent, setIsDateEvent] = useState<boolean>(defaultCalevent.style.isAllDay);
//   const [updateTitle, setUpdateTitle] = useState<string>(defaultCalevent.title);
//   const [updateDescription, setUpdateDescription] = useState<string>(defaultCalevent.description);
//   const updateTitleInputRef = useRef<HTMLInputElement|null>(null);

//   const updateTime = useMemo(()=>function({start,end}:{start?:MdateTz,end?:MdateTz}){
//     const duration = updatingDatetime.end.unix - updatingDatetime.start.unix
//     let newStart = start ? start : updatingDatetime.start
//     let newEnd = end ? end : updatingDatetime.end
//     if(!updatingDatetime.keepduration && newStart.unix >= newEnd.unix) return;
//     if(updatingDatetime.keepduration){
//       if(start) newEnd = newStart.addMs(duration);
//       if(end) newStart = newEnd.addMs(-duration);
//     }
//     setUpdatingDatetime({start:newStart, end:newEnd,keepduration:updatingDatetime.keepduration})
//   }, [updatingDatetime, setUpdatingDatetime]);

//   const calcDurationString = useMemo(()=>function(){
//     let milliseconds = defaultCalevent.endMdate.unix - defaultCalevent.startMdate.unix;
//     const days = Math.floor(milliseconds / DAY);
//     milliseconds -= DAY * days;
//     const hours = Math.floor(milliseconds / HOUR);
//     milliseconds -= HOUR * hours;
//     const minutes = Math.ceil(milliseconds / MINUTE);
//     const texts = new Array<string>();
//     if(days > 0) texts.push(`${days} ${days === 1 ? "day" : "days"}`)
//     if(hours > 0) texts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`)
//     if(minutes > 0) texts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`)
//     return texts.join(", ")
//   }, [defaultCalevent]);

//   const durationString = useMemo(()=>{
//     const start = defaultCalevent.startMdate.toTz(timezone).format("MM/DD(ddd) HH:mm","en");
//     const startDateText = defaultCalevent.startMdate.toTz(timezone).format("MM/DD");
//     const endDateText = defaultCalevent.endMdate.toTz(timezone).format("MM/DD");
//     const format = (startDateText == endDateText) ? "HH:mm" : "MM/DD(ddd) HH:mm";
//     const end = defaultCalevent.endMdate.toTz(timezone).format(format,"en");
//     return `${start} ~ ${end}`;
//   }, [defaultCalevent, timezone]);

//   return (
//     <div>
//       <div className="mt-2 flex justify-end">
//         <label className="inline-flex items-center cursor-pointer">
//           <span className="me-2 text-sm font-medium text-gray-900 dark:text-gray-300">Edit</span>
//           <input
//             type="checkbox"
//             defaultChecked={isEditing}
//             onChange={e=>setIsEditing(e.currentTarget.checked)}
//             className="sr-only peer"
//           />
//           <div
//             className="
//               relative w-9 h-5 bg-gray-200
//               peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
//               rounded-full peer
//               peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600
//               after:content-[''] after:absolute after:top-[2px] after:start-[2px]
//               after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all
//             "
//           ></div>
//         </label>
//       </div>
//       {
//         !isEditing ? (
//           <div>
//             <p className="block mb-1 text-md font-medium text-gray-900">{defaultCalevent.title}</p>
//             <p className="block text-sm font-medium text-gray-900">{defaultCalevent.calendar.name}</p>
//             <div className="flex gap-1 text-sm font-normal text-gray-900">{durationString}</div>
//             <p className="block text-sm font-normal text-gray-900">{calcDurationString()}</p>
//           </div>
//         ) : (
//           <div>
//             <div className="mb-3">
//               <label className="block mb-1 text-sm font-medium text-gray-900">Title</label>
//               <div className="relative">
//                 <input
//                   className="
//                     block w-full p-2.5 text-sm text-gray-900 border border-gray-300
//                     rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500
//                   "
//                   onChange={e=>setUpdateTitle(e.currentTarget.value)}
//                   defaultValue={defaultCalevent.title}
//                   placeholder={defaultCalevent.title}
//                   required={true}
//                   ref={updateTitleInputRef}
//                 />
//                 {
//                   defaultCalevent.title != updateTitle &&
//                   <button
//                     className="
//                       text-white absolute end-2 bottom-1 bg-blue-700 hover:bg-blue-800
//                       focus:ring-4 focus:outline-none focus:ring-blue-300
//                       font-medium rounded-lg text-sm px-2 py-1.5
//                     "
//                     onClick={()=>{
//                       if(updateTitleInputRef.current == null) return;
//                       updateTitleInputRef.current.value = defaultCalevent.title
//                       setUpdateTitle(defaultCalevent.title)
//                     }}
//                   >Reset</button>
//                 }
//               </div>
//             </div>
//             <div className="mb-3">
//               <label className="block mb-1 text-sm font-medium text-gray-900">DataTime Range</label>
//               <div className="flex">
//                 <input type="datetime-local"
//                   className="
//                     grow
//                     block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm
//                     focus:ring-blue-500 focus:border-blue-500
//                   "
//                   value={updatingDatetime.start.format("YYYY-MM-DDTHH:mm","en")}
//                   max={!updatingDatetime.keepduration?updatingDatetime.end.forkAdd(-1,'minute').format("YYYY-MM-DDTHH:mm"):""}
//                   onChange={e=>updateTime({start:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DDTHH:mm",timezone)})}
//                 />
//                 <span className="grow-0 my-auto mx-2"> ~ </span>
//                 <input type="datetime-local"
//                   className="
//                     grow
//                     block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm
//                     focus:ring-blue-500 focus:border-blue-500
//                   "
//                   value={updatingDatetime.end.format("YYYY-MM-DDTHH:mm","en")}
//                   min={!updatingDatetime.keepduration?updatingDatetime.start.forkAdd(1,'minute').format("YYYY-MM-DDTHH:mm"):""}
//                   onChange={e=>updateTime({end:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DDTHH:mm",timezone)})}
//                 />
//               </div>
//             </div>
//             <div className="mb-1">
//               <label className="inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   defaultChecked={updatingDatetime.keepduration!}
//                   onChange={e=>{
//                     setUpdatingDatetime({...updatingDatetime, keepduration:e.currentTarget.checked})
//                   }}
//                   className="sr-only peer"
//                 />
//                 <div
//                   className="
//                     relative w-9 h-5 bg-gray-200
//                     peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
//                     rounded-full peer
//                     peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600
//                     after:content-[''] after:absolute after:top-[2px] after:start-[2px]
//                     after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all
//                   "
//                 ></div>
//                 <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Keep Duration</span>
//               </label>
//             </div>
//             <div className="mb-1">
//               <label className="inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   defaultChecked={defaultCalevent.style.isAllDay}
//                   onChange={e=>setIsDateEvent(e.currentTarget.checked)}
//                   className="sr-only peer"
//                 />
//                 <div
//                   className="
//                     relative w-9 h-5 bg-gray-200
//                     peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
//                     rounded-full peer
//                     peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600
//                     after:content-[''] after:absolute after:top-[2px] after:start-[2px]
//                     after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all
//                   "
//                 ></div>
//                 <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Is date event</span>
//               </label>
//             </div>
//           </div>
//         )
//       }
//       <div>
//         {
//           !isEditing && defaultCalevent.description &&
//           <>
//             <hr className="h-px my-4 bg-gray-200 border-0"/>
//             <label className="block mb-1 text-sm font-medium text-gray-900">Description</label>
//             <Linkify
//               componentDecorator={(decoratedHref, decoratedText, key)=>(
//                 <a target="blank" href={decoratedHref} key={key}
//                   className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
//                 >{decoratedText}</a>
//               )}
//             >
//               <p className="block text-sm font-normal text-gray-900 whitespace-pre-wrap">{defaultCalevent.description}</p>
//             </Linkify>
//           </>
//         }

//         {
//           isEditing &&
//           <>
//             <label className="block mb-1 text-sm font-medium text-gray-900">Description</label>
//             <textarea
//               className="
//                 block p-2.5 w-full text-sm text-gray-900 bg-gray-50
//                 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
//               "
//               defaultValue={defaultCalevent.description}
//               placeholder={defaultCalevent.description}
//               onChange={e=>setUpdateDescription(e.currentTarget.value)}
//             ></textarea>
//           </>
//         }
//       </div>
//       {
//         isEditing &&
//         <>
//           <hr className="h-px my-4 bg-gray-200 border-0"/>
//           <div className="mb-1">
//             <p className="block text-sm font-normal text-gray-900">eventId</p>
//             <p className="block text-sm font-normal text-gray-900">{defaultCalevent.id}</p>
//           </div>
//           <div className="mb-1">
//             <p className="block text-sm font-normal text-gray-900">calendarId</p>
//             <p className="block text-sm font-normal text-gray-900">{defaultCalevent.calendarId}</p>
//           </div>
//           <hr className="h-px my-4 bg-gray-200 border-0"/>
//           <div className="mt-5 flex justify-end gap-2">
//             <button type="button"
//               className="
//                 text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700
//                 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300
//                 font-medium rounded-lg text-sm px-5 py-2.5 text-center
//               "
//               onClick={()=>{
//                 if(window.confirm("Are you really delete this event?")){
//                   deleteDefaultCalevent({
//                     defaultCaleventId: defaultCalevent.id,
//                     calendarId: defaultCalevent.calendarId
//                   })
//                   .then(defaultCalevent=>{
//                     refreshCaleventByRemove(convertClientCalevent(defaultCalevent,timezone,calendar));
//                   })
//                   .catch(error=>{
//                     addToast("DeleteEventError", error.message, "error");
//                   })
//                   closeModal();
//                 }
//               }}
//             >Delete Event</button>
//             <button type="button"
//               className="
//                 text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600
//                 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300
//                 font-medium rounded-lg text-sm px-5 py-2.5 text-center
//               "
//               onClick={()=>{
//                 if(updatingDatetime.start.unix >= updatingDatetime.end.unix) return addToast("InputError", "start >= end", "warning");
//                 updateCalevent({
//                   caleventId: calevent.id,
//                   calendarId: calevent.calendarId,
//                   title: calevent.title != updateTitle ? updateTitle : undefined,
//                   description: calevent.description != updateDescription ? updateDescription : undefined,
//                   startMdate: updatingDatetime.start,
//                   endMdate: updatingDatetime.end,
//                   // is_date_event: isDateEvent
//                 }).then(calevent=>{
//                   refreshCaleventByUpdate(convertClientCalevent(calevent,timezone,calendar));
//                 })
//                 .catch(e=>{window.alert(e)});
//                 closeModal();
//               }}
//             >Save Changes</button>
//           </div>
//         </>
//       }
//     </div>
//   )
// }

export default function CaleventEdit({
  calevent,
  calendar,
  timezone,
  refreshCaleventByUpdate,
  refreshCaleventByRemove,
  closeModal
}:{
  calevent: CaleventType,
  calendar: CalendarType,
  timezone: TimeZone,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,update:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
  closeModal: ()=>void,
}){
  return <CaleventCommonView calevent={calevent} calendar={calendar} timezone={timezone} loading={true}/>;
  // const { addToast } = useToast();
  // const [ calevent, setCalevent ] = useState<CaleventType|null>(null);
  // useEffect(()=>{
  //   fetchCalevent({
  //     defaultCalendarId: calevent.calendarId,
  //     defaultCaleventId: calevent.id,
  //   })
  //   .then(googleCalevent=>{
  //     setGoogleCalevent(googleCalevent);
  //   })
  //   .catch(error=>{
  //     addToast("FetchGcalEventFailed", error.message, "error");
  //   })
  // }, [calevent])

  // if(googleCalevent == null) return <></>;
  // return (
  //   <GoogleCaleventEdit
  //     caleventId={calevent.id}
  //     calendar={calendar}
  //     timezone={timezone}
  //     googleCalevent={googleCalevent}
  //     refreshCaleventByUpdate={refreshCaleventByUpdate}
  //     refreshCaleventByRemove={refreshCaleventByRemove}
  //     closeModal={closeModal}
  //   />
  // );
}