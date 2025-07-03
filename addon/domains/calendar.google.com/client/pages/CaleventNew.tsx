import { useEffect, useMemo, useRef, useState } from 'react';
import { createGoogleCalevent } from '../data/googleCalevent';
import { MdateTz, TimeZone } from '@ymwc/mdate';
import { useToast } from 'maruyu-webcommons/react/toast';
import { CaleventIdType, CaleventType } from '@client/types/calevent';
import { CalendarType } from "@client/types/calendar";
import { GoogleCalendarSchema, GoogleCalendarType } from "../types/googleCalendar";
import { convertFetchItemResponseToClient } from "../types/googleCalevent";
import { convertColidToColor } from "../../share/func/googleCalevent";
import { convertGoogleCaleventDateToMdate as c } from '../func/googleCalevnt';
import ColorSelector from '../components/ColorSelector';
import { HexColorType } from 'maruyu-webcommons/commons/utils/color';
import SummaryForm from '../components/SummaryForm';


function GoogleCaleventNew({
  clickedDate,
  timezone,
  googleCalendar,
  refreshCaleventByCreate,
  closeModal,
}:{
  clickedDate: MdateTz,
  timezone: TimeZone,
  googleCalendar: GoogleCalendarType,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();

  const [ startMdate, setStartMdate ] = useState<MdateTz>(clickedDate);
  const [ endMdate, setEndMdate ] = useState<MdateTz>(clickedDate.forkAdd(15,'minute'));
  const [ keepduration, setKeepduration ] = useState<boolean>(false);
  // const [ isDateEvent, setIsDateEvent ] = useState<boolean>(false);
  const [ summary, setSummary ] = useState<string>("");
  const [ description, setDescription ] = useState<string>("");
  const [ colorId, setColorId ] = useState<number>(0);

  const startTimeRef = useRef<HTMLInputElement|null>(null);
  const endTimeRef = useRef<HTMLInputElement|null>(null);

  const updateTime = useMemo(()=>function({start,end}:{start?:MdateTz,end?:MdateTz}){
    const duration = endMdate.unix - startMdate.unix
    let newStart = start ? start : startMdate
    let newEnd = end ? end : endMdate
    if(!keepduration && newStart.unix >= newEnd.unix) return;
    if(keepduration){
      if(start) newEnd = newStart.forkAdd(duration,'millisecond');
      if(end) newStart = newEnd.forkAdd(-duration, 'millisecond');
    }
    setStartMdate(newStart);
    setEndMdate(newEnd);
  }, [startMdate, endMdate, keepduration, setStartMdate, setEndMdate]);
  useEffect(()=>{
    if(startTimeRef.current) startTimeRef.current.value = startMdate.format("YYYY-MM-DDTHH:mm");
  }, [startMdate])
  useEffect(()=>{
    if(endTimeRef.current) endTimeRef.current.value = endMdate.format("YYYY-MM-DDTHH:mm");
  }, [endMdate])

  return (
    <div>
      <label className="block mb-1 text-sm font-thin text-gray-900">Summary</label>
      <div className="flex gap-x-1 items-center mb-3">
        <ColorSelector 
          colorId={colorId}
          defaultColor={googleCalendar.style?.color?? "#000000" as HexColorType}
          setColorId={colorId=>setColorId(colorId)}
        />
        <SummaryForm 
          summary={summary}
          setSummary={summary=>setSummary(summary)}
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 text-sm font-thin text-gray-900">DataTime Range</label>
        <div className="flex">
          <input type="datetime-local"
            className="
              grow
              block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm
              focus:ring-blue-500 focus:border-blue-500
            "
            ref={startTimeRef}
            max={keepduration?endMdate.forkAdd(-1,'minute').format("YYYY-MM-DDTHH:mm"):""}
            onChange={e=>updateTime({start:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DD HH:mm",timezone)})}
          />
          <span className="grow-0 my-auto mx-2"> ~ </span>
          <input type="datetime-local"
            className="
              grow
              block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm
              focus:ring-blue-500 focus:border-blue-500
            "
            ref={endTimeRef}
            min={keepduration?startMdate.forkAdd(1,'minute').format("YYYY-MM-DDTHH:mm"):""}
            onChange={e=>updateTime({end:MdateTz.parseFormat(e.currentTarget.value,"YYYY-MM-DD HH:mm",timezone)})}
          />
        </div>
      </div>
      <div className="mb-1">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={keepduration}
            onChange={e=>setKeepduration(e.currentTarget.checked)}
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
        <label className="block mb-1 text-sm font-thin text-gray-900">Description</label>
        <textarea
          className="
            block p-2.5 w-full text-sm text-gray-900 bg-gray-50
            rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500
          "
          defaultValue={description}
          onChange={e=>setDescription(e.currentTarget.value)}
        ></textarea>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button type="button"
          onClick={closeModal}
          className="
            text-white bg-yellow-500
            hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300
            font-medium rounded-lg text-sm px-5 py-2.5 text-center
          ">Cancel</button>
        <button type="button"
          className="
            text-white bg-blue-400
            hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300
            font-medium rounded-lg text-sm px-5 py-2.5 text-center
          "
          onClick={async (e)=>{
            if(startMdate.unix >= endMdate.unix) return addToast("InputError", "startMdate >= endMdate", "warning");
            createGoogleCalevent({
              calendarId: googleCalendar.id,
              summary, description, 
              start: { dateTime: startMdate.toIsoString() },
              end: { dateTime: endMdate.toIsoString() },
              colorId,
            })
            .then(responseObject=>convertFetchItemResponseToClient(responseObject))
            .then(googleCalevent=>{
              if(googleCalevent.start == undefined) return;
              if(googleCalevent.end == undefined) return;
              const color = convertColidToColor(googleCalevent.colorId);
              refreshCaleventByCreate({
                id: googleCalevent.eventId as unknown as CaleventIdType,
                calendarId: googleCalendar.id,
                title: googleCalevent.summary,
                startMdate: c(googleCalevent.start, timezone),
                endMdate: c(googleCalevent.end, timezone),
                permissions: ["read", "write", "edit", "delete"],
                style: {
                  mainColor: (color == null) ? googleCalendar.style.color : color,
                  isAllDay: googleCalevent.start.date ? true : false,
                },
                updatedAt: new Date(),
              });
            })
            .catch(e=>{
              addToast("CreateCaleventError", e.message, "error");
            })
            closeModal();
          }}
        >Save</button>
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

  const googleCalendar = useMemo<GoogleCalendarType|null>(()=>{
    const { success, error, data: googleCalendar } = GoogleCalendarSchema.safeParse(calendar);
    if(!success) {
      console.error("Validation failed:");
      console.dir(error.format(), {depth:null});
      addToast("FetchGcalEventFailed", error.message, "error");
      return null;
    }
    return googleCalendar;
  }, [ calendar ]);

  if(googleCalendar == null) return <></>;
  return (
    <GoogleCaleventNew
      clickedDate={clickedDate}
      timezone={timezone}
      googleCalendar={googleCalendar}
      refreshCaleventByCreate={refreshCaleventByCreate}
      closeModal={closeModal}
    />
  )
}