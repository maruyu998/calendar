// import express from 'express';
// import GoogleCalendarRouter from './googlecalendar/index';
// import * as calendarEvent from '../../calendarEvent';
// import * as googleCalendarSync from '../../external/googlecalendar/sync';
// import { CalendarEvent, GCalCalendarId, GCalEventId, MongoCalendarId, MongoEventId } from 'mtypes/CalendarEvent';
// import { sendData, sendError, sendMessage } from 'maruyu-webcommons/node/express';
// import { requireBodyParams, requireQueryParams, requireSignin } from 'maruyu-webcommons/node/middleware';
// import Mdate from 'maruyu-webcommons/commons/utils/mdate';
// import * as TimeLogEvent from "../../external/time.maruyu.work/timelog";

// const router = express.Router();

// router.use('/googlecalendar', GoogleCalendarRouter);

// router.get('/calendars', [
//   requireSignin
// ], async function(req, res){
//   const { userName } = res.locals.userInfo as UserInfoType;
//   const calendarList = await calendarEvent.get_calendars({user_id: userName});
//   sendData(res, "CalendarList", `getting calendars success, ${calendarList.length} calendars.`, { calendarList })
// })

// router.get('/events', [
//   requireSignin,
//   requireQueryParams("start", "end", "calendar_ids", "is_new")
// ], async function(req:express.Request, res:express.Response){
//   const { userName } = res.locals.userInfo as UserInfoType;
//   const start = new Mdate(Number(req.query.start!));
//   const end = new Mdate(Number(req.query.end!));
//   const calendar_ids:MongoCalendarId[] = String(req.query.calendar_ids||"").split(',') as MongoCalendarId[];
//   const is_new = Boolean(req.query.is_new||false);
//   if(is_new){
//     calendarEvent.get_googlecalendars({user_id:userName})
//       .then(gcals=>gcals.filter(gcal=>(gcal.calendar_type==="googlecalendar" && calendar_ids.includes(gcal.id!))))
//       .then(gcals=>gcals.map(gcal=>gcal.unique_key!) as GCalCalendarId[])
//       .then(gcals=>googleCalendarSync.syncEvents({user_id:userName, start, end, calendar_ids:gcals}))
//   }
//   const events: CalendarEvent[] = await calendarEvent.get_events({user_id:userName,start,end,calendar_ids})
//   sendData(res, "Events", `getting events with is_new=${is_new}, ${start.toIsoString()}~${end.toIsoString()}, ${events.length} events.`, { events })
// })

// router.post('/event', [
//   requireSignin
// ], async function(req, res){
//   const { userName } = res.locals.userInfo as UserInfoType;
//   const title = req.body.title;
//   const calendar_id:MongoCalendarId = req.body.calendar_id;
//   if(calendar_id === undefined)       return sendMessage(res, "", "calendar_id is required.")
//   if(title === undefined)             return sendMessage(res, "", "title is required.")
//   if(req.body.start === undefined)    return sendMessage(res, "", "start is required.")
//   if(req.body.end === undefined)      return sendMessage(res, "", "end is required.")
//   const start = new Mdate(Number(req.body.start!));
//   const end = new Mdate(Number(req.body.end!));
//   // const is_date_event = Boolean(req.body.is_date_event);
//   const calendar = await calendarEvent.get_calendars({user_id:userName}).then(calendars=>calendars.find(c=>c.id===calendar_id))
//   if(!calendar) return sendMessage(res, "", "calendar is not exist.")
//   // await calendarEvent.create_event({user_id:userName, event:{start, end, title, is_date_event, }})
//   if(calendar.calendar_type !== "googlecalendar") return sendMessage(res, "", `calendar type is not supported: ${calendar.calendar_type}`)
//   const gcal_calid = calendar.unique_key as GCalCalendarId
//   try{
//     await googleCalendarSync.createEvent(userName, gcal_calid, title, start, end)
//   }catch(error){
//     return sendError(res, error as Error)
//   }
//   return sendMessage(res, "", `event creation maybe success, ${title}`);
// })

// router.put('/event', [
//   requireSignin,
//   requireBodyParams("event_id", "calendar_id", "start", "end", "is_date_event")
// ], async function(request, response){
//   const { userName } = response.locals.userInfo as UserInfoType;
//   let { event_id, start, end } = response.locals.bodies;
//   start = new Mdate(Number(start));
//   end = new Mdate(Number(end));
//   const is_date_event = Boolean(request.body.is_date_event);
//   const event = await calendarEvent.get_event({user_id:userName, event_id});
//   if(!event) return sendMessage(response, "", "event is deleted.");
//   if(event.external.googlecalendar){
//     const gcal_id = event.external.googlecalendar.event_id
//     const gcal_calid = event.external.googlecalendar.calendar_id
//     try{
//       await googleCalendarSync.updateEvent(userName, gcal_calid, gcal_id, start, end)
//     }catch(error){
//       return sendError(response, error as Error)
//     }
//   }
//   await calendarEvent.upsert_event({user_id:userName, event:{...event, start, end, is_date_event}})
//   return sendMessage(response, "", `updation maybe success, event_id=${event_id}, ${event.title}`)
// })

// router.delete('/event', [
//   requireSignin,
//   requireBodyParams("event_id")
// ], async function(request, response){
//   const { userName } = response.locals.userInfo as UserInfoType;
//   const event_id:MongoEventId = response.locals.bodies.event_id;
//   const event = await calendarEvent.get_event({user_id:userName, event_id})
//   if(!event) return sendMessage(response, "", `event is already deleted, event_id=${event_id}`)
//   await calendarEvent.delete_event({user_id:userName, event_id})
//   if(event.external.googlecalendar){
//     const gcal_id:GCalEventId = event.external.googlecalendar.event_id
//     const gcal_calid:GCalCalendarId = event.external.googlecalendar.calendar_id
//     try{
//       await googleCalendarSync.deleteEvent(userName, gcal_calid, gcal_id)
//     }catch(error){
//       return sendError(response, error as Error)
//     }
//   }
//   return sendMessage(response, "", `deletion maybe success, event_id=${event_id}, ${event.title}`)
// })

// router.get("/session", [
//   requireSignin,
//   requireQueryParams("key")
// ], async function(request, response){
//   const { key } = response.locals.queries;
//   if(request.session.clientData === undefined) request.session.clientData = {}
//   const data = request.session.clientData[key]
//   sendData(response, "SessionData", key, data);
// })

// router.put("/session", [
//   requireSignin,
//   requireBodyParams("key", "data")
// ], async function(request, response){
//   const { key, data } = response.locals.bodies;
//   if(request.session.clientData === undefined) request.session.clientData = {}
//   request.session.clientData[key] = data;
//   sendMessage(response, "SessionDataSaved", `session ${key} is saved.`)
// })

// // https://qiita.com/chenglin/items/b4bd94507e384962c609
// // router.get("/ical", [
// //   requireQueryParams("key")
// // ], async function(request, response){
// //   const { key } = response.locals.queries;

// // })

// export default router;
export {}