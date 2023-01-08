import express from 'express';
import { CalendarEvent, CalendarEventGroup } from 'mtypes/CalendarEvent';

export function sendJson(response:express.Response, {
    message=undefined,
    events=undefined,
    eventGroup=undefined,
    url=undefined
}:{
    message?:string,
    events?: CalendarEvent[],
    eventGroup?: CalendarEventGroup,
    url?: string
}){
    response.json({
        message,
        events,
        eventGroup,
        url
    })
}