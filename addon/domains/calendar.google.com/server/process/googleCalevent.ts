import { calendar_v3 } from 'googleapis';
import { IsoStringType, Mdate } from "@ymwc/mdate";
import { getCalendar } from "./connect";
import { RawGoogleCaleventType } from '../types/googleCalevent';
import { GoogleCalendarIdType } from "../../share/types/googleCalendar";
import { GoogleCaleventDateType, GoogleCaleventIdType } from '../../share/types/googleCalevent';
import { UserIdType } from 'maruyu-webcommons/commons/types/user';

const inMemoryCacheEventList:{
  lastFetchedAt: Mdate|null,
  eventList: []
} = {
  lastFetchedAt: null,
  eventList: []
}

export async function fetchEventListByDataRange({
  userId,
  googleCalendarId,
  timeMin,
  timeMax,
}:{
  userId: UserIdType,
  googleCalendarId: GoogleCalendarIdType,
  timeMin: IsoStringType,
  timeMax: IsoStringType,
}):Promise<RawGoogleCaleventType[]>{
  const calendar = await getCalendar({userId});

  async function fetchEventListPage({
    calendar,
    pageToken
  }:{
    calendar: calendar_v3.Calendar,
    pageToken: string|null
  }){
    const ListRequestObject:calendar_v3.Params$Resource$Events$List = {
      calendarId: googleCalendarId,
      timeMin,
      timeMax,
      maxResults: 9999,
      singleEvents: true,
      orderBy: "startTime"
    }
    if(pageToken) ListRequestObject.pageToken = pageToken;
    return calendar.events.list(ListRequestObject)
          .then(response=>{
            if(response.data.items == undefined) {
              throw new Error("google fetch result is empty (undefined)");
            }
            return {
              eventList: response.data.items,
              nextPageToken: response.data.nextPageToken??null
            };
          });
  }
  const caleventList = new Array<RawGoogleCaleventType>();
  let pageToken:string|null = null;
  while(true){
    const { eventList, nextPageToken } = await fetchEventListPage({calendar, pageToken});
    caleventList.push(...eventList);
    pageToken = nextPageToken;
    if(pageToken == null) break;
  }
  return caleventList;
}

export async function fetchEventListByLastUpdate({
  userId,
  googleCalendarId,
  lastUpdateMdate,
}:{
  userId: UserIdType,
  googleCalendarId: GoogleCalendarIdType,
  lastUpdateMdate: Mdate
}):Promise<RawGoogleCaleventType[]>{
  const calendar = await getCalendar({userId});

  async function fetchEventListPage({
    calendar,
    pageToken
  }:{
    calendar: calendar_v3.Calendar,
    pageToken: string|null
  }){
    const ListRequestObject:calendar_v3.Params$Resource$Events$List = {
      calendarId: googleCalendarId,
      updatedMin: lastUpdateMdate.toIsoString(),
      maxResults: 9999,
      singleEvents: true,
      orderBy: "startTime"
    }
    if(pageToken) ListRequestObject.pageToken = pageToken;
    return calendar.events.list(ListRequestObject)
          .then(response=>{
            if(response.data.items == undefined) {
              throw new Error("google fetch result is empty (undefined)");
            }
            return {
              eventList: response.data.items,
              nextPageToken: response.data.nextPageToken??null
            };
          });
  }
  const caleventList = new Array<RawGoogleCaleventType>();
  let pageToken:string|null = null;
  while(true){
    const { eventList, nextPageToken } = await fetchEventListPage({calendar, pageToken});
    caleventList.push(...eventList);
    pageToken = nextPageToken;
    if(pageToken == null) break;
  }
  return caleventList;
}

export async function fetchEvent({
  userId,
  calendarId,
  eventId,
}:{
  userId: UserIdType,
  calendarId: GoogleCalendarIdType,
  eventId: GoogleCaleventIdType,
}):Promise<RawGoogleCaleventType>{
  const calendar = await getCalendar({userId});

  // const permission = await calendar.calendarList.list().then(res=>(
  //   res.data.items?.find(cal=>cal.id===googleCalendarId)?.accessRole??null
  // ))
  // if(permission === "freeBusyReader"){
  //   throw new Error(`calendar(google calendar) is not writable. ${googleCalendarId}`);
  // }

  const gcalevent:RawGoogleCaleventType = await calendar.events.get({ calendarId, eventId },{ responseType:'json' }).then(res=>res.data);
  if(gcalevent.status === "cancelled") {
    throw new Error(`google calendar event is already removed ${calendarId}`);
  }
  return gcalevent;
}

export async function createEvent(props:{
  userId: UserIdType,
  calendarId: GoogleCalendarIdType,
  summary: string,
  description: string,
  start: GoogleCaleventDateType,
  end: GoogleCaleventDateType,
}):Promise<RawGoogleCaleventType>{
  const { userId, calendarId, ...requestBody } = props;
  const calendar = await getCalendar({userId: userId});

  const permission = await calendar.calendarList.list().then(res=>(
    res.data.items?.find(cal=>cal.id===calendarId)?.accessRole??null
  ))
  if(permission === "freeBusyReader" || permission === "reader") {
    throw new Error(`calendar(google calendar) is not writable. ${calendarId}`);
  }
  return await calendar.events.insert(
    { calendarId, requestBody }, { responseType:'json' }
  ).then(response=>response.data);
}

export async function updateEvent(props:{
  userId: UserIdType,
  calendarId: GoogleCalendarIdType,
  eventId: GoogleCaleventIdType,
  summary?: string,
  description?: string,
  start?: GoogleCaleventDateType,
  end?: GoogleCaleventDateType,
}):Promise<RawGoogleCaleventType>{
  const { userId, calendarId, eventId, ...requestBody } = props;
  const calendar = await getCalendar({userId});

  const permission = await calendar.calendarList.list().then(res=>(
    res.data.items?.find(cal=>cal.id===calendarId)?.accessRole??null
  ))
  if(permission === "freeBusyReader" || permission === "reader") {
    throw new Error(`calendar(google calendar) is not writable. ${calendarId}`);
  }
  const gcalevent:RawGoogleCaleventType = await calendar.events.get({ calendarId, eventId })
                                                .then(response=>response.data);
  if(gcalevent.status === "cancelled") {
    throw new Error(`google calendar event is already removed ${eventId}`);
  }

  return await calendar.events.patch({ calendarId, eventId, requestBody },{responseType:'json'})
              .then(response=>response.data);
}


export async function deleteEvent({
  userId,
  calendarId,
  eventId,
}:{
  userId: UserIdType,
  calendarId: GoogleCalendarIdType,
  eventId: GoogleCaleventIdType,
}):Promise<RawGoogleCaleventType>{
  const calendar = await getCalendar({userId});

  const permission = await calendar.calendarList.list().then(res=>(
    res.data.items?.find(cal=>cal.id===calendarId)?.accessRole??null
  ))
  if(permission === "freeBusyReader" || permission === "reader") {
    throw new Error(`calendar(google calendar) is not writable. ${calendarId}`);
  }
  const gcalevent:RawGoogleCaleventType = await calendar.events.get({ calendarId, eventId })
                                                .then(response=>response.data);
  if(gcalevent.status === "cancelled") {
    throw new Error(`google calendar event is already removed ${eventId}`);
  }

  await calendar.events.delete({ calendarId, eventId },{responseType:'json'})
        .then(response=>response.data);

  return gcalevent;
}