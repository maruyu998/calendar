import { getPacket } from "maruyu-webcommons/commons/utils/fetch";
import { CalendarType } from "mtypes/v2/Calendar";

export async function getCalendarList():Promise<CalendarType[]>{
  return await getPacket('/api/v2/calendar/list', {}, window)
  .then(({title,message,data})=>{
    if(data==null) throw new Error("data is null");
    return data as { calendarList }
  })
  .then(data=>data.calendarList)
  .catch(error=>console.error(error))
}