import { CalendarEvent } from 'mtypes/CalendarEvent';
import { getData, postData } from './utils/aggregator';

export async function get_events({user_id}:{user_id:string}){
    return await getData("calendar", "events", user_id).then(res=>res.events)
}

export async function add_events({user_id, event}:{user_id:string, event:CalendarEvent}){
    return await postData("calendar", "event", user_id, {event})
}