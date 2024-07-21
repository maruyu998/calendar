import { google, calendar_v3 } from 'googleapis';
import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { getCalendar } from "./connect";

type GoogleCaleventType = calendar_v3.Schema$Event;

const inMemoryCacheEventList:{
  lastFetchedAt: Mdate|null,
  eventList: []
} = {
  lastFetchedAt: null,
  eventList: []
}

export async function fetchEventListByDataRange({
  userName,
  googleCalendarId,
  startMdate, 
  endMdate
}:{
  userName: string,
  googleCalendarId: string,
  startMdate: Mdate, 
  endMdate: Mdate
}):Promise<GoogleCaleventType[]>{
  const calendar = await getCalendar(userName);
  if(!calendar) throw new Error("calendar(google calendar) is not found.");

  async function fetchEventListPage({
    calendar,
    pageToken
  }:{
    calendar: calendar_v3.Calendar,
    pageToken: string|null
  }){
    const ListRequestObject:calendar_v3.Params$Resource$Events$List = {
      calendarId: googleCalendarId,
      timeMin: startMdate.toIsoString(),
      timeMax: endMdate.toIsoString(),
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
  const caleventList = new Array<GoogleCaleventType>();
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
  userName,
  googleCalendarId,
  lastUpdateMdate,
}:{
  userName: string,
  googleCalendarId: string,
  lastUpdateMdate: Mdate
}):Promise<GoogleCaleventType[]>{
  const calendar = await getCalendar(userName);
  if(!calendar) throw new Error("calendar(google calendar) is not found.");

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
  const caleventList = new Array<GoogleCaleventType>();
  let pageToken:string|null = null;
  while(true){
    const { eventList, nextPageToken } = await fetchEventListPage({calendar, pageToken});
    caleventList.push(...eventList);
    pageToken = nextPageToken;
    if(pageToken == null) break;
  }
  return caleventList;
}


export async function addEvent({
  userName,
  googleCalendarId,
  title,
  startMdate, 
  endMdate
}:{
  userName: string,
  googleCalendarId: string,
  title: string,
  startMdate: Mdate, 
  endMdate: Mdate
}):Promise<GoogleCaleventType>{
  const calendar = await getCalendar(userName);
  if(!calendar) throw new Error("calendar(google calendar) is not found.");

  const permission = await calendar.calendarList.list().then(res=>(
    res.data.items?.find(cal=>cal.id===googleCalendarId)?.accessRole??null
  ))
  if(permission === "freeBusyReader" || permission === "reader") {
    throw new Error(`calendar(google calendar) is not writable. ${googleCalendarId}`);
  }

  return await calendar.events.insert({
                  calendarId: googleCalendarId,
                  requestBody: {
                    summary: title,
                    start: { dateTime: startMdate.toIsoString() },
                    end: { dateTime: endMdate.toIsoString() }
                  }
                },{ responseType:'json' })
                .then(response=>response.data);
}

export async function updateEvent({
  userName,
  googleCalendarId,
  googleCaleventId,
  title,
  startMdate, 
  endMdate
}:{
  userName: string,
  googleCalendarId: string,
  googleCaleventId: string,
  title?: string,
  startMdate?: Mdate, 
  endMdate?: Mdate
}):Promise<GoogleCaleventType>{
  const calendar = await getCalendar(userName);
  if(!calendar) throw new Error("calendar(google calendar) is not found.");

  const permission = await calendar.calendarList.list().then(res=>(
    res.data.items?.find(cal=>cal.id===googleCalendarId)?.accessRole??null
  ))
  if(permission === "freeBusyReader" || permission === "reader") {
    throw new Error(`calendar(google calendar) is not writable. ${googleCalendarId}`);
  }
  const gcalevent:GoogleCaleventType = await calendar.events.get({
    calendarId: googleCalendarId,
    eventId: googleCaleventId
  }).then(res=>res.data);
  if(gcalevent.status === "cancelled") {
    throw new Error(`google calendar event is already removed ${googleCaleventId}`);
  }
  if(title) gcalevent.summary = title;
  if(startMdate) gcalevent.start = { dateTime: startMdate.toIsoString() };
  if(endMdate) gcalevent.end = { dateTime: endMdate.toIsoString() };

  return await calendar.events.update({
                  calendarId: googleCalendarId,
                  eventId: googleCaleventId,
                  requestBody: { ...gcalevent }
                },{responseType:'json'})
                .then(response=>response.data);
}


export async function deleteEvent({
  userName,
  googleCalendarId,
  googleCaleventId,
}:{
  userName: string,
  googleCalendarId: string,
  googleCaleventId: string,
}):Promise<GoogleCaleventType>{
  const calendar = await getCalendar(userName);
  if(!calendar) throw new Error("calendar(google calendar) is not found.");

  const permission = await calendar.calendarList.list().then(res=>(
    res.data.items?.find(cal=>cal.id===googleCalendarId)?.accessRole??null
  ))
  if(permission === "freeBusyReader" || permission === "reader") {
    throw new Error(`calendar(google calendar) is not writable. ${googleCalendarId}`);
  }
  const gcalevent:GoogleCaleventType = await calendar.events.get({
    calendarId: googleCalendarId,
    eventId: googleCaleventId
  }).then(res=>res.data);
  if(gcalevent.status === "cancelled") {
    throw new Error(`google calendar event is already removed ${googleCaleventId}`);
  }

  await calendar.events.delete({
    calendarId: googleCalendarId,
    eventId: googleCaleventId
  },{responseType:'json'})
  .then(response=>response.data);
  
  return gcalevent;
}