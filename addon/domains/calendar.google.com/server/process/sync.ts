import { InternalServerError } from '@ymwc/errors';
import { updateItem as mongoUpdateItem } from '@server/mongoose/CalendarModel';
import { getCalendar } from './connect';
import { DOMAIN } from '../../const';
import { CalendarPermissionType, CalendarSourceType, CalendarUniqueKeyInSourceType } from '@share/types/calendar';
import { HexColorType } from '@ymwc/utils';
import { UserIdType } from '@server/types/user';

export async function refreshCalendarList({
  userId
}:{
  userId: UserIdType
}){
  const calendar = await getCalendar({userId});
  const calendarList = await calendar.calendarList.list().then(res=>{
    if(res.data.items == undefined) throw new InternalServerError("fetched calendar list from google is undefined.");
    return res.data.items;
  });
  for(let gcal of calendarList){
    console.log({gcal});
    if(gcal.id == null || gcal.id == undefined) throw new InternalServerError("google calendar does not have id");
    const permissions:CalendarPermissionType[]
                      = (gcal.accessRole == "owner")  ? ["readList","readItem","writeItem","editItem","deleteItem"]
                      : (gcal.accessRole == "writer") ? ["readList","readItem","writeItem","editItem","deleteItem"]
                      : (gcal.accessRole == "reader") ? ["readList","readItem"]
                      : (gcal.accessRole == "freeBusyReader") ? ["readList"]
                      : (gcal.accessRole == "none") ? []
                      : ["readList"];
    await mongoUpdateItem({
      userId,
      calendarSource: DOMAIN as CalendarSourceType,
      uniqueKeyInSource: gcal.id as CalendarUniqueKeyInSourceType,
      name: gcal.summary ?? "",
      description: gcal.description ?? "",
      permissions,
      style: {
        display: "showInList",
        color: (gcal.backgroundColor ?? "#3b82f6") as HexColorType,
      },
      data: {
        timezone: gcal.timeZone ?? "",
        accessRole: gcal.accessRole,
      }
    });
  }
  return calendarList;
}
//
// import { calendar_v3 } from 'googleapis';
// import { getCalendar } from './connect';
// import { get_googlecalendars, upsert_calendar, get_event_by_gcid, upsert_event_by_gcid, delete_event_by_gcid } from '../../calendarEvent';
// import { CalendarEvent, Calendar, GCalCalendarId, GCalEventId, getGCalAccessRole, CancelledEvent } from '../../../mtypes/CalendarEvent';
// import { DateRecord, UpdateRecord, lock, unlock } from '../../utils/mongooses';
// import { Mdate, TimeZone } from 'maruyu-webcommons/commons/utils/mdate';
// import { DAY, MINUTE } from 'maruyu-webcommons/commons/utils/time';
// export async function refreshCalendarList(userId, userName){
//   const calendar = await getCalendar(userName);
//   if(!calendar) return null;
//   const calendarList = await calendar.calendarList.list().then(res=>res.data.items).catch(e=>{console.error(e.message);return null});
//   if(calendarList){
//     for(let gcal of calendarList){
//       await upsert_calendar({
//         userId,
//         userName,
//         calendar_type: "googlecalendar",
//         unique_key: gcal.id!,
//         calendar: {
//           summary: gcal.summary || "",
//           description: gcal.description || "",
//           external: {
//             googlecalendar: {
//               timezone: gcal.timeZone || "",
//               access_role: getGCalAccessRole(gcal.accessRole!),
//               background_color: gcal.backgroundColor || "",
//             }
//           }
//         }
//       })
//     }
//   }
//   return calendarList;
// }

//


// export async function refreshCalendarEvents(user_id:string, start:Mdate, end:Mdate, _calendar:Calendar){
//   const calendar = await getCalendar(user_id);
//   if(!calendar) return []
//   const timezone = _calendar.external.googlecalendar!.timezone as TimeZone;
//   const events:CalendarEvent[] = await calendar!.events.list({
//     calendarId: _calendar.unique_key,
//     timeMin: start.toIsoString(),
//     timeMax: end.toIsoString(),
//     maxResults: 9999,
//     singleEvents: true,
//     orderBy: "startTime"
//   }).then(res=>res.data.items).then(events=>{
//     if(events === undefined) return []
//     return events.map((e:calendar_v3.Schema$Event)=>({
//       title: e.summary!,
//       start: e.start!.date ? Mdate.parse(e.start!.date!,timezone,"YYYY-MM-DD") : Mdate.parse(e.start!.dateTime!),
//       end: e.end!.date ? Mdate.parse(e.end!.date!,timezone,"YYYY-MM-DD").addMs(-1 * MINUTE) : Mdate.parse(e.end!.dateTime!),
//       is_date_event: e.start!.date ? true : false,
//       description: e.description || "",
//       calendar_id: _calendar.id!,
//       external: {
//         googlecalendar: {
//           event_id: (e.id || "") as GCalEventId,
//           calendar_id: (_calendar.unique_key || "") as GCalCalendarId,
//           url: e.htmlLink || "",
//           updated_at: e.updated ? Mdate.parse(e.updated!) : undefined
//         }
//       },
//       display_styles: {
//         background_color: getCalendarColor(e.colorId||0)
//       }
//     }))
//   }).catch(e=>{
//     console.error("refreshCalendarEvents", e)
//     return new Array<CalendarEvent>()
//   })
//   return events || []
// }

// export async function fetchUpdatedCalendarEvents(
//   user_id:string,
//   updated_min:Mdate,
//   _calendar:Calendar,
//   page_token:string|null
// ):Promise<{
//   existed_events:CalendarEvent[],
//   cancelled_events:CancelledEvent[],
//   next_page_token:string|null
// }>{
//   const calendar = await getCalendar(user_id);
//   if(!calendar) return {existed_events:[], cancelled_events:[], next_page_token:null}
//   const timezone = _calendar.external.googlecalendar!.timezone as TimeZone;
//   const {gc_events, next_page_token}:{gc_events:calendar_v3.Schema$Event[], next_page_token:string|null} = await calendar!.events.list({
//     calendarId: _calendar.unique_key,
//     updatedMin: updated_min.toIsoString(),
//     maxResults: 9999,
//     singleEvents: true,
//     orderBy: "updated",
//     pageToken: page_token || undefined
//   }).then(res=>({
//     gc_events: res.data.items ? res.data.items : [],
//     next_page_token: res.data.nextPageToken || null
//   })).catch(e=>({gc_events:[], next_page_token:null}))
//   const existed_events:CalendarEvent[] = new Array<CalendarEvent>()
//   const cancelled_events:CancelledEvent[] = new Array<CancelledEvent>()
//   gc_events.forEach((e:calendar_v3.Schema$Event)=>{
//     if(e.status !== "cancelled") existed_events.push({
//       title: e.summary!,
//       start: e.start!.date ? Mdate.parse(e.start!.date!,timezone,"YYYY-MM-DD") : Mdate.parse(e.start!.dateTime!),
//       end: e.end!.date ? Mdate.parse(e.end!.date!,timezone,"YYYY-MM-DD").addMs(-1 * MINUTE) : Mdate.parse(e.end!.dateTime!),
//       is_date_event: e.start!.date ? true : false,
//       description: e.description || "",
//       calendar_id: _calendar.id!,
//       external: {
//         googlecalendar: {
//           event_id: (e.id || "") as GCalEventId,
//           calendar_id: (_calendar.unique_key || "") as GCalCalendarId,
//           url: e.htmlLink || "",
//           updated_at: e.updated ? Mdate.parse(e.updated!) : undefined
//         },
//       },
//       display_styles: {
//         background_color: getCalendarColor(e.colorId||0)
//       }
//     })
//     else cancelled_events.push({
//       calendar_id: _calendar.id!,
//       external: {
//         googlecalendar: {
//           event_id: (e.id || "") as GCalEventId,
//           calendar_id: (_calendar.unique_key || "") as GCalCalendarId,
//           url: e.htmlLink || "",
//           updated_at: e.updated ? Mdate.parse(e.updated!) : undefined
//         }
//       }
//     })
//   })
//   return {existed_events, cancelled_events, next_page_token}
// }

// export async function refleshCalendarsEvents(user_id:string, start_date:Mdate, end_date:Mdate, gcids:GCalCalendarId[]){
//   const calendarList = await get_googlecalendars({user_id});
//   if(calendarList===null) return null;
//   const events:CalendarEvent[] = (await Promise.all(
//     calendarList.filter(c=>gcids.includes(c.unique_key! as GCalCalendarId))
//           .map(cl=>refreshCalendarEvents(user_id, start_date, end_date, cl)))
//   ).flat()
//   return events
// }

// export async function fetchUpdatedCalendarsEvents(
//   user_id:string,
//   updated_min:Mdate,
//   gcids:GCalCalendarId[],
//   page_token:(string|null)[]
// ):Promise<null|{
//   existed_events: CalendarEvent[],
//   cancelled_events: CancelledEvent[],
//   next_page_token_map: Record<string, string|null>
// }>{

//   const calendarList = await get_googlecalendars({user_id});
//   if(calendarList===null) return null;
//   const page_token_map = Object.assign({}, ...gcids.map((gcid,i)=>({[gcid]:page_token[i]})))

//   const fetch_rets = await Promise.all([
//     ...calendarList.filter(c=>gcids.includes(c.unique_key! as GCalCalendarId))
//     .map(cl=>fetchUpdatedCalendarEvents(user_id, updated_min, cl, page_token_map[cl.unique_key!]).then(res=>({...res, calendar_id:cl.unique_key})))
//   ])
//   const existed_events:CalendarEvent[] = [...fetch_rets.map(es=>es.existed_events)].flat()
//   const cancelled_events:CancelledEvent[] = [...fetch_rets.map(es=>es.cancelled_events)].flat()
//   const next_page_token_map:Record<string, string|null> = Object.assign({}, ...fetch_rets.map(es=>({[es.calendar_id!]: es.next_page_token})))
//   return {existed_events, cancelled_events, next_page_token_map}
// }

// export async function addEvent(user_id:string, calendar_id:GCalCalendarId, title:string, start:Mdate, end:Mdate){
//   const calendar = await getCalendar(user_id);
//   if(!calendar) return;
//   const permission = await calendar.calendarList.list().then(res=>res.data.items?.filter(cal=>cal.id===calendar_id)[0].accessRole)
//   if(permission === "freeBusyReader" || permission === "reader") return;
//   await calendar.events.insert({
//     calendarId: calendar_id,
//     requestBody: {
//       summary: title,
//       start: {dateTime: start.toIsoString()},
//       end: {dateTime: end.toIsoString()}
//     }
//   },{responseType:'json'})
// }

// export async function updateEvent(user_id:string, calendar_id:GCalCalendarId, event_id:GCalEventId, start:Mdate, end:Mdate){
//   const calendar = await getCalendar(user_id);
//   if(!calendar) return;
//   const permission = await calendar.calendarList.list().then(res=>res.data.items?.filter(cal=>cal.id===calendar_id)[0].accessRole)
//   if(permission === "freeBusyReader" || permission === "reader") return;
//   const event = await calendar.events.get({calendarId: calendar_id, eventId: event_id}).then(res=>res.data)
//   await calendar.events.update({
//     calendarId: calendar_id,
//     eventId: event_id,
//     requestBody: {
//       ...event,
//       start: {dateTime: start.toIsoString()},
//       end: {dateTime: end.toIsoString()}
//     }
//   },{responseType:'json'})
// }

// export async function deleteEvent(user_id:string, calendar_id:GCalCalendarId, event_id:GCalEventId){
//   const calendar = await getCalendar(user_id);
//   if(!calendar) return []
//   const permission = await calendar.calendarList.list().then(res=>res.data.items?.filter(cal=>cal.id===calendar_id)[0].accessRole)
//   const event = await calendar.events.get({calendarId: calendar_id, eventId: event_id}).then(res=>res.data)
//   if(event.status === "cancelled") return;
//   if(permission === "freeBusyReader" || permission === "reader") return;
//   return await calendar.events.delete({
//     calendarId: calendar_id,
//     eventId: event_id
//   },{responseType:'json'})
// }

// export async function syncEvents({
//   user_id,
//   start,
//   end,
//   calendar_ids
// }:{
//   user_id: string,
//   start: Mdate,
//   end: Mdate,
//   calendar_ids:GCalCalendarId[]
// }){
//   for(let calendar_id of calendar_ids){
//     while(!(await lock('UpdateRecord'))){await new Promise(resolve=>setTimeout(resolve, 50))}
//     const updateRecord = await UpdateRecord.findOne({user:user_id, calendar:calendar_id}).exec();
//     // const updated_min:Mdate = updateRecord ? new Mdate(updateRecord!.date!.getTime()) : Mdate.now().add(-28,'day')
//     const updated_min:Mdate = updateRecord ? new Mdate(updateRecord!.date!.getTime()) : Mdate.now().addMs(-1 * DAY)
//     const next_page_token:string|null = updateRecord ? updateRecord.next_page_token : null
//     const fetching_time:Mdate = Mdate.now()
//     const fetch_ret = await fetchUpdatedCalendarsEvents(user_id, updated_min, [calendar_id], [next_page_token])
//     if(fetch_ret == null) { console.log("error, zero events"); await unlock("UpdateRecord"); continue }
//     const { existed_events, cancelled_events, next_page_token_map } = fetch_ret;
//     let new_updated_min:Mdate = updated_min
//     for(let e_event of existed_events){
//       const f_event = await get_event_by_gcid({user_id, gc_event_id: e_event.external.googlecalendar!.event_id})
//       await upsert_event_by_gcid({user_id, event:{
//         ...e_event,
//         is_date_event: f_event ? f_event.is_date_event : e_event.is_date_event
//       }})
//       if(e_event.external.googlecalendar!.updated_at && e_event.external.googlecalendar!.updated_at.unix > updated_min.unix)
//         new_updated_min = e_event.external.googlecalendar!.updated_at
//       process.stdout.write("x")
//     }
//     for(let c_event of cancelled_events){
//       await delete_event_by_gcid({user_id, gc_event_id: c_event.external.googlecalendar!.event_id})
//       if(c_event.external.googlecalendar!.updated_at && c_event.external.googlecalendar!.updated_at.unix > updated_min.unix)
//         new_updated_min = c_event.external.googlecalendar!.updated_at
//       // console.log("<<<UPDATED EVENT>>>", c_event.external.googlecalendar!.event_id)
//       process.stdout.write("c")
//     }
//     if(updated_min.unix === new_updated_min.unix) new_updated_min = fetching_time
//     try{
//       await UpdateRecord.findOneAndUpdate(
//         {user:user_id, calendar:calendar_id},
//         {$set:{date:new_updated_min.toDate(), next_page_token:next_page_token_map[calendar_id]}},
//         {upsert:true,new:true}
//       ).exec();
//     }catch(e){}
//     await unlock('UpdateRecord')
//   }
//   for(let calendar_id of calendar_ids){
//     for(let date=start; date.unix<=end.addMs(-1 * DAY).unix; date=date.addMs(1 * DAY)){
//       // console.log("UPDATE DATE", date.format("YYYY/MM/DD HH:mm:ss", "Asia/Tokyo"));
//       while(!(await lock('DateRecord'))){await new Promise(resolve=>setTimeout(resolve, 50))}
//       const dateRecord = await DateRecord.findOne({user:user_id, date:date.toDate(), calendar:calendar_id}).exec()
//       if(dateRecord) { await unlock('DateRecord'); continue }
//       const events = await refleshCalendarsEvents(user_id, date, date.addMs(1 * DAY), [calendar_id])
//       if(events == null) { await unlock('DateRecord'); continue }
//       for(let event of events){
//         const f_event = await get_event_by_gcid({user_id, gc_event_id: event.external.googlecalendar!.event_id})
//         await upsert_event_by_gcid({user_id, event:{
//           ...event,
//           is_date_event: f_event ? f_event.is_date_event : event.is_date_event
//         }})
//         process.stdout.write("o")
//       }
//       try{
//         await DateRecord.create({user:user_id, date:date.toDate(), calendar:calendar_id})
//       }catch(e){}
//       await unlock('DateRecord')
//     }
//   }
// }