import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MdateTz } from '@ymwc/mdate';
import { CalendarSourceType, CalendarType } from "@client/types/calendar";
import { useSetting } from '@client/contexts/SettingProvider';
import { useStatus } from '@client/contexts/StatusProvider';
import { CaleventNewForm } from "@addon/client";
import { useEvents } from '@client/contexts/EventsProvider';
import { HexColorType } from 'maruyu-webcommons/commons/utils/color';

function Card({
  name,
  calendarSource,
  color,
  onClickHandler,
}:{
  name: string,
  calendarSource: CalendarSourceType,
  color: HexColorType,
  onClickHandler: ()=>void,
}): React.ReactElement {
  return (
    <div className="
        block py-1 px-3 bg-white border rounded-lg shadow-sm cursor-pointer
        hover:bg-indigo-200 border-gray-200
      "
      onClick={e=>onClickHandler()}
    >
      <div className="flex gap-x-3 items-center">
        { color && <div className="w-8 h-8 rounded-full border" style={{backgroundColor:color}}/> }
        <div>
          <p className="text-xs font-light">{calendarSource}</p>
          <p className="text-sm">{name}</p>
        </div>
      </div>
    </div>
  )
}

export default function CaleventNew({
  clickedDate,
  closeModal,
}:{
  clickedDate: MdateTz,
  closeModal: ()=>void,
}): React.ReactElement {
  const { calendarList } = useStatus();
  const { showCalIds, timezone } = useSetting();
  const { refreshCaleventByCreate } = useEvents();

  const [ calendarId, setCalendarId ] = useState<string|null>(null);
  const [ calendar, setCalendar ] = useState<CalendarType|null>(null);
  useEffect(()=>{
    setCalendar(calendarList.find(calendar=>calendar.id == calendarId) ?? null);
  }, [ calendarId ])

  return (
    <div onClick={e=>e.stopPropagation()}>
      <div className="mb-3">
        {
          calendar == null ? (<>
            <label className="block mb-1 text-sm font-medium text-gray-900">Select Calendar</label>
            <div className="max-h-[80%] w-full gap-y-0.5 overflow-y-auto">
              { calendarList
                .filter(c=>c.id&&showCalIds.includes(c.id))
                .filter(c=>c.permissions.includes("writeItem"))
                .map(c=>(
                  <React.Fragment key={c.id}>
                    <Card name={c.name} calendarSource={c.calendarSource}
                      onClickHandler={()=>setCalendarId(c.id)}
                      color={c.style.color}
                    />
                  </React.Fragment>
                ))
              }
            </div>
          </>):(
            <Card name={calendar.name} calendarSource={calendar.calendarSource}
              onClickHandler={()=>setCalendarId(null)}
              color={calendar.style.color}
            />
          )
        }
      </div>
      {
        calendar !== null &&
        <CaleventNewForm 
          clickedDate={clickedDate} 
          timezone={timezone}
          calendar={calendar} 
          refreshCaleventByCreate={refreshCaleventByCreate}
          closeModal={closeModal}
        ></CaleventNewForm>
      }
    </div>
  )
}