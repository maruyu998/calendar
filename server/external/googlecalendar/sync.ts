import { google, calendar_v3 } from 'googleapis';
import { getCalendar } from './connect';
import { getData, updateData } from '../../utils/aggregator';
import { CalendarEvent, GCalCalendar, GCalEvent } from '../../../mtypes/CalendarEvent';
import MDate from '../../../mutils/mdate';

export async function getCalendarList(user_id):Promise<GCalCalendar[]>{
    return await getData("calendar","calendars",user_id).then(res=>res.calendars.map(c=>c.data))
}

export function getCalendarColor(color_id:number|string){
    if(typeof color_id == "string") color_id = Number(color_id)
    const color_list = [
        "default", "#7986CB", "#33B679", "#8E24AA", "#E67C73", 
        "#F6BF26", "#F4511E", "#039BE5", "#616161", "#3F51B5", 
        "#0B8043", "#D50000"
    ]
    if(color_id < 0 || color_id >= color_list.length) throw new Error(`color_id is not in range. ${color_id}`)
    return color_list[color_id]
}

export async function refreshCalendarList(user_id){
    const calendar = await getCalendar(user_id)
    if(!calendar) return null;
    const calendarList = await calendar.calendarList.list().then(res=>res.data.items).catch(e=>{console.error(e.message);return null})
    if(calendarList!==null){
        for(let gcal of calendarList!!){
            await updateData("calendar","calendar",user_id,[
                {key:"calendar_type",value:"googlecalendar"},{key:"unique_key",value:gcal.id!!}
            ], gcal)
        }
    }
    return calendarList;
}

export async function refreshCalendarEvents(user_id:string, start_date:MDate, end_date:MDate, _calendar:GCalCalendar){
    const calendar = await getCalendar(user_id);
    if(!calendar) return []
    const events:CalendarEvent[] = await calendar.events.list({
        calendarId: _calendar.id,
        timeMin: start_date.toISOString(),
        timeMax: end_date.toISOString(),
        maxResults: 9999,
        singleEvents: true,
        orderBy: "startTime"
    }).then(res=>res.data.items).then(events=>{
        if(events === undefined) return []
        return events.map((e)=>({
            title: e.summary!,
            start_datetime: MDate.parse(e.start!.dateTime!),
            end_datetime: MDate.parse(e.end!.dateTime!),
            calendar_id: _calendar.id,
            display_styles: {
                background_color: getCalendarColor(e.colorId||0)
            }
        }))
    }).catch(e=>{
        console.error(e)
        return []
    })
    console.log(events)
    return events || []
}

export async function refleshCalendarsEvents(user_id:string, start_date:MDate, end_date:MDate, gcids:string[]){
    const calendarList = await getCalendarList(user_id);
    if(calendarList===null) return null;
    console.log(start_date.toISOString(), end_date.toISOString())
    let events:CalendarEvent[] = (await Promise.all(
        calendarList.filter(c=>gcids.includes(c.id)).map(cl=>refreshCalendarEvents(user_id, start_date, end_date, cl)))
    ).flat()
    return events
}