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
  const aggregatorCalendarIdMap = {
    // fitbit sleep
    "013300e5-05a7-4e28-91d6-82906c0e940e": "659ba456eb0a791d7674b1f1",
    // withings
    "06558db0-3d10-4098-8638-342a9ea71b85": "640f5fb81f46489c663e7cff",
  }
  const aggregatorCalendarId = aggregatorCalendarIdMap[calendarId];
  if(aggregatorCalendarId == undefined) throw new Error(`calendar Id is not set in code(map) ${calendarId}`);
  
  const aggregatorCaleventList:AggregatorCalevent[] 
    = await getData("calendar", "events", userName, [
      {key: "start_time", value: String(startMdate.unix)},
      {key: "end_time", value: String(endMdate.unix)},
      {key: "calendar_ids", value: aggregatorCalendarId}
    ]).then((res:any)=>res.events as AggregatorCalevent[])
  
  const eventList = new Array<CaleventType>();
  for(const aggregatorCalevent of aggregatorCaleventList){
    const mainColor = aggregatorCalevent.display_styles.background_color;
    const externals = new Array<{url:string, name:string}>();
    // if(aggregatorCalevent.external.googlecalendar) externals.push({name:"Google Calendar", "url":aggregatorCalevent.external.googlecalendar.url});
    if(aggregatorCalevent.external.fitbit) externals.push({name:"Fitbit", "url":aggregatorCalevent.external.fitbit.url});
    if(aggregatorCalevent.external.withings) externals.push({name:"Withings", "url":aggregatorCalevent.external.withings.url});
    eventList.push({
      id: aggregatorCalevent.id as CaleventIdType,
      calendarId: calendarId,
      calendarSource: "health.maruyu.work",
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
      data: {
        externals
      }
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