import { MdateTz, TimeZone } from "maruyu-webcommons/commons/utils/mdate";
import { CalendarType } from "mtypes/v2/Calendar";
import { CaleventClientType, CaleventType } from "mtypes/v2/Calevent";

export function convertClientCalevent(
  calevent: CaleventType,
  timezone: TimeZone,
  calendarList: CalendarType[]
):CaleventClientType{
  const calendar = calendarList.find(c=>c.id===calevent.calendarId);
  if(calendar == undefined) throw new Error(`
    calendar[${calevent.calendarId}] is not found in [${calendarList.map(c=>c.id).join(",")}]
  `);
  return {
    ...calevent,
    startMdate: new MdateTz(calevent.startTime.getTime(), timezone),
    endMdate: new MdateTz(calevent.endTime.getTime(), timezone),
    calendar: calendar
  }
}
