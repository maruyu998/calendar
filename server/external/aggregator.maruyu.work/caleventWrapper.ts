import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { getData } from "maruyu-webcommons/node/aggregator";
import { CalendarIdType } from "mtypes/v2/Calendar";
import { CaleventIdType, CaleventType } from "mtypes/v2/Calevent";

type AggregatorCalevent = {
  id: string,
  title: string,
  start_time: number,
  end_time: number,
  calendar_id: string,
  is_date_event: boolean,
  description: string,
  external: {
    googlecalendar?: {
      event_id: string,
      calendar_id: string,
      url: string
    },
    withings?: {
      sleep_id: string,
      url: string
    },
    fitbit?: {
      logId: string,
      url: string
    }
  },
  display_styles: {
    background_color: string
  }
}

export async function fetchCalevent({
  userId,
  userName,
  calendarId,
  startMdate,
  endMdate
}:{
  userId: string,
  userName: string,
  calendarId: CalendarIdType
  startMdate: Mdate,
  endMdate: Mdate
}){
  const aggregatorCalendarId = calendarId;
  const aggregatorCaleventList:AggregatorCalevent[] 
    = await getData("calendar", "events", userName, [
      {key: "start_time", value: String(startMdate.unix)},
      {key: "end_time", value: String(endMdate.unix)},
      {key: "calendar_ids", value: aggregatorCalendarId}
    ]).then((res:any)=>res.events as AggregatorCalevent[])
  
  const eventList = new Array<CaleventType>();
  for(const aggregatorCalevent of aggregatorCaleventList){
    const mainColor = aggregatorCalevent.display_styles.background_color;
    eventList.push({
      id: aggregatorCalevent.id as CaleventIdType,
      calendarId: calendarId,
      calendarSource: "calendar.maruyu.work",
      title: aggregatorCalevent.title,
      description: aggregatorCalevent.description,
      startTime: new Mdate(aggregatorCalevent.start_time).toDate(),
      endTime: new Mdate(aggregatorCalevent.end_time).toDate(),
      style: {
        isAllDay: aggregatorCalevent.is_date_event,
        display: "show",
        mainColor: mainColor == "default" ? undefined : mainColor
      },
      isDeleted: false,
      data: {}
    })
  }
  return eventList;
}

// export async function addCalevent({
//   userId,
//   title,
//   startMdate,
//   endMdate
// }:{
//   userId: string,
//   title: string,
//   startMdate: Mdate,
//   endMdate: Mdate
// }){
//   const timeLog = await TimeLog.addTimeLog({
//     userId, 
//     timeQuotaId: title.trim(),
//     startMdate, 
//     endMdate
//   })
// }