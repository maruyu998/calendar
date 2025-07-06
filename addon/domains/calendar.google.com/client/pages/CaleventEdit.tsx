import { useEffect, useMemo, useRef, useState } from 'react';
import { updateGoogleCalevent, deleteGoogleCalevent, fetchGoogleCalevent, createGoogleCalevent } from '../data/googleCalevent';
import { TimeZone } from '@ymwc/mdate';
import { useToast } from '@ymwc/react-core';
import { CalendarType } from "@client/types/calendar";
import { CaleventIdType, CaleventType } from "@client/types/calevent";
import {
  convertFetchItemResponseToClient as convertGoogleCaleventFetchItemResponseToClient, 
  convertCreateItemResponseToClient as convertGoogleCaleventCreateItemResponseToClient,
  convertUpdateItemResponseToClient as convertGoogleCaleventUpdateItemResponseToClient, 
  GoogleCaleventType,
} from "../types/googleCalevent";
import { GoogleCalendarSchema, GoogleCalendarType } from "../types/googleCalendar";
import { GoogleCaleventDateType, GoogleCaleventIdType } from '../../share/types/googleCalevent';
import CaleventCommonView from '@addon/client/components/CaleventCommonView';
import DeleteButton from '@addon/client/components/DeleteButton';
import DuplicateButton from '@addon/client/components/DuplicateButton';
import DescriptionForm from '../components/DescriptionForm';
import SummaryForm from '../components/SummaryForm';
import ColorSelector from '../components/ColorSelector';
import { HexColorType } from '@ymwc/utils';
import { UpdateRefreshItemType } from '@client/contexts/EventsProvider';
import { convertColidToColor } from '../../share/func/googleCalevent';
import DurationForm from '../components/DurationForm';
import { convertGoogleCaleventDateToMdate } from '../func/googleCalevnt';

function GoogleCaleventEdit({
  caleventId,
  googleCalendar,
  timezone,
  googleCalevent,
  setGoogleCalevent,
  refreshCaleventByCreate,
  refreshCaleventByUpdate,
  refreshCaleventByRemove,
  closeModal,
}:{
  caleventId: CaleventIdType,
  googleCalendar: GoogleCalendarType,
  timezone: TimeZone,
  googleCalevent: GoogleCaleventType,
  setGoogleCalevent: (googleCalevent:GoogleCaleventType)=>void,
  refreshCaleventByCreate:(calevent:CaleventType)=>void,
  refreshCaleventByUpdate:(caleventId:CaleventIdType,update:UpdateRefreshItemType)=>void,
  refreshCaleventByRemove:(caleventId:CaleventIdType)=>void,
  closeModal: ()=>void,
}){
  const { addToast } = useToast();

  return (
    <div className="relative mb-8">
      <div className="absolute top-2 right-2 flex gap-x-1">
        <DuplicateButton
          duplicateHandler={()=>{
            createGoogleCalevent({
              calendarId: googleCalendar.id,
              start: googleCalevent.start as GoogleCaleventDateType,
              end: googleCalevent.end as GoogleCaleventDateType,
              summary: googleCalevent.summary,
              description: googleCalevent.description,
              colorId: googleCalevent.colorId,
            })
            .then(responseObject=>convertGoogleCaleventCreateItemResponseToClient(responseObject))
            .then(googleCalevent=>{
              refreshCaleventByCreate({
                id: googleCalevent.eventId as unknown as CaleventIdType,
                calendarId: googleCalendar.id,
                title: googleCalevent.summary,
                startMdate: convertGoogleCaleventDateToMdate(googleCalevent.start, timezone),
                endMdate: convertGoogleCaleventDateToMdate(googleCalevent.end, timezone),
                permissions: ["read", "edit"],
                style: {
                  mainColor: convertColidToColor(googleCalevent.colorId) ?? googleCalendar.style.color ?? "#000000" as HexColorType,
                  isAllDay: false,
                },
                updatedAt: new Date(),
              });
            })
            .catch(e=>{
              addToast("CreateEventError", e.message, "error");
            });
            closeModal();
          }}
        />
        <DeleteButton 
          deleteHandler={()=>{
            deleteGoogleCalevent({ calendarId: googleCalendar.id, eventId: googleCalevent.eventId })
              .catch(error=>addToast("DeleteGoogleCaleventError", error.message, "error"));
            refreshCaleventByRemove(caleventId);
            closeModal();
          }}
        />
      </div>
      <div className="mb-2">
        <p className="text-xs text-gray-700">{googleCalendar.calendarSource}</p>
        <p className="text-gray-700">{googleCalendar.name}</p>
      </div>
      <div className="flex gap-x-1 items-center">
        <ColorSelector 
          colorId={googleCalevent.colorId??0}
          defaultColor={googleCalendar.style?.color?? "#000000" as HexColorType}
          setColorId={colorId=>{
            if(colorId == googleCalevent.colorId) return;
            setGoogleCalevent({ ...googleCalevent, colorId });
            updateGoogleCalevent({ calendarId: googleCalendar.id, eventId: googleCalevent.eventId, colorId })
              .then(responseObject=>convertGoogleCaleventUpdateItemResponseToClient(responseObject))
              .then(googleCalevent=>{
                setGoogleCalevent(googleCalevent);
                refreshCaleventByUpdate(caleventId, {
                  style: {
                    mainColor: convertColidToColor(googleCalevent.colorId) ?? googleCalendar.style.color ?? "#000000" as HexColorType,
                    isAllDay: false,
                  }
                });
              })
              .catch(error=>addToast("UpdateGoogleCaleventError", error.message, "error"));
          }}
        />
        <SummaryForm 
          summary={googleCalevent.summary}
          setSummary={summary=>{            
            if(summary == googleCalevent.summary) return;
            setGoogleCalevent({ ...googleCalevent, summary });
            updateGoogleCalevent({ calendarId: googleCalendar.id, eventId: googleCalevent.eventId, summary })
              .then(responseObject=>convertGoogleCaleventUpdateItemResponseToClient(responseObject))
              .then(googleCalevent=>{
                setGoogleCalevent(googleCalevent);
                refreshCaleventByUpdate(caleventId, { title: googleCalevent.summary });
              })
              .catch(error=>addToast("UpdateGoogleCaleventError", error.message, "error"));
          }}
        />
      </div>
      <DurationForm 
        start={googleCalevent.start}
        end={googleCalevent.end}
        timezone={timezone}
        setDuration={(start:GoogleCaleventDateType,end:GoogleCaleventDateType)=>{
          const c = (date: GoogleCaleventDateType) => convertGoogleCaleventDateToMdate(date, timezone);
          if(c(googleCalevent.start).unix == c(start).unix && c(googleCalevent.end).unix == c(end).unix) return;
          if(c(start).unix >= c(end).unix) return addToast("InputError", "start >= end", "warning");
          setGoogleCalevent({ ...googleCalevent, start, end });
          updateGoogleCalevent({ calendarId: googleCalendar.id, eventId: googleCalevent.eventId, start, end })
            .then(responseObject=>convertGoogleCaleventUpdateItemResponseToClient(responseObject))
            .then(googleCalevent=>{
              setGoogleCalevent(googleCalevent);
              refreshCaleventByUpdate(caleventId, { startMdate: c(googleCalevent.start), endMdate: c(googleCalevent.end) });
            })
            .catch(error=>addToast("UpdateGoogleCaleventError", error.message, "error"));
        }}
      />
      <DescriptionForm 
        description={googleCalevent.description}
        setDescription={description=>{
          if(description == googleCalevent.description) return;
          setGoogleCalevent({ ...googleCalevent, description });
          updateGoogleCalevent({ calendarId: googleCalendar.id, eventId: googleCalevent.eventId, description })
            .then(responseObject=>convertGoogleCaleventUpdateItemResponseToClient(responseObject))
            .then(googleCalevent=>{
              setGoogleCalevent(googleCalevent);
            })
            .catch(error=>addToast("UpdateGoogleCaleventError", error.message, "error"));
        }}
      />
      <div>
        <hr className="h-px my-4 bg-gray-200 border-0"/>
        <button type="button"
          className="
            text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500
            hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300
            font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2
          "
          onClick={()=>{window.open(googleCalevent.url, '_blank');closeModal()}}
        >GCalendar</button>
      </div>
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
  closeModal,
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
  const [ googleCalevent, setGoogleCalevent ] = useState<GoogleCaleventType|null>(null);
  useEffect(()=>{
    fetchGoogleCalevent({
      calendarId: calendar.id,
      eventId: calevent.id as unknown as GoogleCaleventIdType,
    })
    .then(responseObject=>convertGoogleCaleventFetchItemResponseToClient(responseObject))
    .then(googleCalevent=>{
      setGoogleCalevent(googleCalevent);
    })
    .catch(error=>{
      addToast("FetchGcalEventFailed", error.message, "error");
    })
  }, [calevent])

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

  if(googleCalendar == null || googleCalevent == null) return (
    <CaleventCommonView calevent={calevent} calendar={calendar} timezone={timezone} loading={true}/>
  );
  return (
    <GoogleCaleventEdit
      caleventId={calevent.id}
      googleCalendar={googleCalendar}
      googleCalevent={googleCalevent}
      setGoogleCalevent={setGoogleCalevent}
      timezone={timezone}
      refreshCaleventByCreate={refreshCaleventByCreate}
      refreshCaleventByUpdate={refreshCaleventByUpdate}
      refreshCaleventByRemove={refreshCaleventByRemove}
      closeModal={closeModal}
    />
  );
}