import express from 'express';
import { CalendarEvent, CalendarEventGroup } from 'mtypes/CalendarEvent';
import { timezone } from 'mtypes/date';


export function sendJson(response:express.Response, {
    message=undefined,
    events=undefined,
    eventGroup=undefined,
    url=undefined,
    calendarList=undefined,
    tz=undefined
}:{
    message?:string,
    events?: CalendarEvent[],
    eventGroup?: CalendarEventGroup,
    url?: string,
    calendarList?: any,
    tz?: timezone
}){
    response.json({
        message,
        events,
        eventGroup,
        url,
        calendarList,
        tz
    })
}