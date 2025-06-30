export {}
// import {
//   Calendar, CalendarType,
//   CalendarEvent, CalendarEventCommunication,
//   convert_from_communication, convert_to_communication,
//   GCalCalendarId, GCalEventId, MongoCalendarId, MongoEventId
// } from 'mtypes/CalendarEvent';
// import { Mdate } from 'maruyu-webcommons/commons/utils/mdate';
// import { CalendarModel } from './mongoose/CalendarModel';
// import { CalendarPermissionType } from 'mtypes/v2/Calendar';

// //// calendar
// export async function get_calendars({
//   user_id
// }:{
//   user_id: string
// }):Promise<Calendar[]>{
//   const calendars = await getData("calendar","calendars",user_id).then((res:any)=>res.calendars) as Calendar[];
//   return calendars;
// }

// export async function get_googlecalendars({
//   user_id
// }:{
//   user_id:string
// }):Promise<Calendar[]>{
//   return await getData("calendar", "calendars", user_id, [
//     {key: "calendar_type", value: "googlecalendar"}
//   ]).then((res:any)=>res.calendars)
// }

// export async function upsert_calendar({
//   userId,
//   userName,
//   calendar_type,
//   unique_key,
//   calendar
// }:{
//   userId: string,
//   userName: string,
//   calendar_type: CalendarType,
//   unique_key: string,
//   calendar: Calendar
// }){
//   const calendarSource = calendar_type == "googlecalendar" ? "calendar.google.com"
//                         : calendar_type == "time.maruyu.work" ? "time.maruyu.work"
//                         : null;
//   const permissions = new Array<CalendarPermissionType>();
//   if(calendarSource == "time.maruyu.work"){
//     permissions.push("readList", "readItem", "writeItem", "editItem", "deleteItem");
//   }
//   if(calendarSource == "calendar.google.com"){
//     if(calendar.external.googlecalendar?.access_role == "owner"){
//       permissions.push("readList", "readItem", "writeItem", "editItem", "deleteItem");
//     }
//     if(calendar.external.googlecalendar?.access_role == "reader"){
//       permissions.push("readList", "readItem");
//     }
//     if(calendar.external.googlecalendar?.access_role == "writer"){
//       permissions.push("readList", "readItem", "writeItem", "editItem");
//     }
//     if(calendar.external.googlecalendar?.access_role == "freeBusyReader"){
//       permissions.push("readList");
//     }
//   }

//   const calendarModel = await CalendarModel.create({
//     userId,
//     calendarSource,
//     uniqueKeyInSource: unique_key,
//     name: calendar.summary,
//     description: calendar.description,
//     permissions,
//     style:{
//       display: "showInList",
//     },
//     data: calendarSource == "calendar.google.com" ? {
//       timezone: calendar.external.googlecalendar?.timezone,
//       accessRole: calendar.external.googlecalendar?.access_role,
//       backgroundColor: calendar.external.googlecalendar?.background_color,
//     } : {}
//   });
// }

// //// event
// export async function get_events({
//   user_id,
//   start,
//   end,
//   calendar_ids
// }:{
//   user_id: string,
//   start: Mdate,
//   end: Mdate,
//   calendar_ids: MongoCalendarId[]
// }):Promise<CalendarEvent[]>{
//   return await getData("calendar", "events", user_id, [
//     {key: "start_time", value: String(start.unix)},
//     {key: "end_time", value: String(end.unix)},
//     {key: "calendar_ids", value: calendar_ids.join(",")}
//   ]).then((res:any)=>res.events.map(convert_from_communication))
// }

// export async function get_event({
//   user_id,
//   event_id
// }:{
//   user_id: string,
//   event_id: MongoEventId
// }):Promise<CalendarEvent|null>{
//   return await getData("calendar", "event", user_id, [
//     {key: "_id", value: event_id}
//   ]).then((res:any)=>((res.event)?convert_from_communication(res.event):null))
// }

// export async function get_event_by_gcid({
//   user_id,
//   gc_event_id
// }:{
//   user_id: string,
//   gc_event_id: GCalEventId
// }):Promise<CalendarEvent|null>{
//   return await getData("calendar", "event", user_id, [{
//     key: 'external.googlecalendar.event_id',
//     value: gc_event_id
//   }]).then((res:any)=>res.event ? convert_from_communication(res.event): null)
// }

// export async function create_event({
//   user_id,
//   event
// }:{
//   user_id: string,
//   event: CalendarEvent
// }){
//   return await postData("calendar", "event", user_id, {event: convert_to_communication(event)}, [
//     // `https://connect.maruyu.work/api/webhook/calendar_event_updated?user_id=${user_id}&event_id=${event.id}&detail=update`
//   ])
// }

// export async function upsert_event({
//   user_id,
//   event
// }:{
//   user_id: string,
//   event: CalendarEvent
// }){
//   const upsert = true;
//   return await updateData("calendar", "event", user_id, [{
//     key: '_id',
//     value: event.id as string
//   }], {event: convert_to_communication(event)}, upsert, [
//     `https://connect.maruyu.work/api/webhook/calendar_event_updated?user_id=${user_id}&event_id=${event.id}&detail=update`
//   ])
// }

// export async function upsert_event_by_gcid({
//   user_id,
//   event
// }:{
//   user_id: string,
//   event: CalendarEvent
// }){
//   return await updateData("calendar", "event", user_id, [{
//     key: 'external.googlecalendar.event_id',
//     value: event.external.googlecalendar!.event_id
//   }], {event: convert_to_communication(event)})
// }

// export async function delete_event({
//   user_id,
//   event_id
// }:{
//   user_id: string,
//   event_id: MongoEventId
// }){
//   await deleteData("calendar", "event", user_id, [{
//     key: '_id',
//     value: event_id
//   }], [
//     `https://connect.maruyu.work/api/webhook/calendar_event_updated?user_id=${user_id}&event_id=${event_id}&detail=delete`
//   ])
// }

// export async function delete_event_by_gcid({
//   user_id,
//   gc_event_id
// }:{
//   user_id: string,
//   gc_event_id: GCalEventId
// }){
//   await deleteData("calendar", "event", user_id, [{
//     key: 'external.googlecalendar.event_id',
//     value: gc_event_id
//   }])
// }