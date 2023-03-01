import express from 'express';
import GoogleCalendarRouter from './external/googlecalendar/router';
import * as calendarEvent from './calendarEvent';
import MDate from '../mutils/mdate';
import { CalendarEvent, CalendarEventGroup } from '../mtypes/CalendarEvent';
import { sendJson } from './utils/express';

const router = express.Router();

router.use('/googlecalendar', GoogleCalendarRouter);

router.get('/events', async function(req, res){
    const user_id = req.session.moauth_user_id;
    if(user_id === undefined){
        return sendJson(res, {message: "login is required"})
    }
    const group = req.query.group;
    const events: CalendarEvent[] = await calendarEvent.get_events({user_id})
    if(!group) return sendJson(res, {events})
    if(group === "date"){
        if(req.query.timezone === undefined) return sendJson(res, {message: "timezone is required"})
        const timezone = String(req.query.timezone!);
        const eventGroup: CalendarEventGroup = {}
        for(let event of events){
            const dateString:string = (event.start_datetime ? event.start_datetime.getDateString(timezone) : "") as string;
            if(eventGroup[dateString] === undefined) eventGroup[dateString] = []
            eventGroup[dateString].push(event)
        }
        return sendJson(res, {eventGroup})
    }
})

router.post('/event', async function(req:express.Request, res:express.Response){
    const user_id = req.session.moauth_user_id;
    if(user_id === undefined){
        return sendJson(res, {message: "login is required"})
    }
    if(req.body.event?.title === undefined) return sendJson(res, {message: "title is required"})
    if(req.body.event?.start_datetime === undefined) return sendJson(res, {message: "start_datetime is required"})
    if(req.body.event?.end_datetime === undefined) return sendJson(res, {message: "end_datetime is required"})
    if(req.body.event?.calendar_id === undefined) return sendJson(res, {message: "calendar_id is required"})
    const event:CalendarEvent = {
        title: req.body.event.title,
        start_datetime: req.body.event.start_datetime,
        end_datetime: req.body.event.end_datetime,
        calendar_id: req.body.event.calendar_id,
        display_styles: {
            background_color: req.body.event?.background_color || 'default'
        }
    }
    const ret = await calendarEvent.add_events({user_id, event})
    return sendJson(res, {message: ret.message});
})

router.post('/tz', async function(req, res){
    const user_id = req.session.moauth_user_id;
    if(user_id === undefined){
        return sendJson(res, {message: "login is required"})
    }
    const tz = req.body.tz;
    if(tz === undefined) return sendJson(res, {message: "tz is required."})
    await calendarEvent.set_tz({user_id, tz})
    return sendJson(res, {message:"ok"})
})

router.get('/tz', async function(req, res){
    const user_id = req.session.moauth_user_id;
    if(user_id === undefined){
        return sendJson(res, {message: "login is required"})
    }
    const tz = await calendarEvent.get_tz({user_id})
    return sendJson(res, {tz})
})

export default router;