import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import * as TimeLog from "./timelog";
import { CalendarIdType } from "mtypes/v2/Calendar";
import { CaleventIdType, CaleventType } from "mtypes/v2/Calevent";

function getTimePurposeList(timeLog:TimeLog.TimeLogType):string[]{
  const purposeList = new Array<string>();
  type TimePurposeType = TimeLog.TimeLogType["timeQuota"]["timePurpose"];
  let timePurpose:TimePurposeType|null = timeLog.timeQuota.timePurpose;
  while(timePurpose){
    purposeList.unshift(timePurpose.name)
    timePurpose = timePurpose.parentPurpose;
  }
  return purposeList;
}

function convertTimeLogToCalevent(
  timeLog: TimeLog.TimeLogType,
  calendarId: CalendarIdType,
):CaleventType{
  const timePurposeList = getTimePurposeList(timeLog);
  return {
    id: timeLog.id as CaleventIdType,
    calendarId: calendarId,
    calendarSource: "time.maruyu.work",
    title: `[T]${timeLog.timeQuota.name}<${timePurposeList.join("/")}>`,
    description:
        `url: https://time.maruyu.work/#/?timeLogId=${timeLog.id}\n`
      + `TimeQuotaId: ${timeLog.timeQuota.id}\n`
      + `Purposes: ${timePurposeList.join("/")}\n\n`
      + (timeLog.output ? `<output>\n${timeLog.output}\n\n` : "") 
      + (timeLog.review ? `<review>\n${timeLog.review}` : ""),
    startTime: timeLog.startTime,
    endTime: timeLog.endTime,
    permissions: ["read", "write", "edit", "delete"],
    style: {
      isAllDay: false,
      display: "show",
      mainColor: timeLog.timeQuota.styles.color
    },
    isDeleted: false,
    data: {}
  };
}

export async function fetchCalevent({
  userId,
  calendarId,
  startMdate,
  endMdate
}:{
  userId: string,
  calendarId: CalendarIdType
  startMdate: Mdate,
  endMdate: Mdate
}):Promise<CaleventType[]>{
  const timeLogList = await TimeLog.fetchTimeLogList({userId, startMdate, endMdate});
  const eventList = timeLogList.map(timeLog=>(
    convertTimeLogToCalevent(timeLog, calendarId)
  ));
  return eventList;
}

export async function addCalevent({
  userId,
  calendarId,
  timeQuotaId,
  startMdate,
  endMdate
}:{
  userId: string,
  calendarId: CalendarIdType,
  timeQuotaId: string,
  startMdate: Mdate,
  endMdate: Mdate
}):Promise<CaleventType>{
  const timeLog = await TimeLog.addTimeLog({
    userId, timeQuotaId, startMdate, endMdate
  });
  const calevent = convertTimeLogToCalevent(timeLog, calendarId);
  return calevent;
}

export async function updateCalevent({
  userId,
  timeLogId,
  calendarId,
  startMdate,
  endMdate
}:{
  userId: string
  timeLogId: string,
  calendarId: CalendarIdType,
  startMdate?: Mdate,
  endMdate?: Mdate
}){
  const updateData:Record<string,any> = {}
  if(startMdate) updateData.startMdate = startMdate;
  if(endMdate) updateData.endMdate = endMdate;
  const timeLog = await TimeLog.updateEvent({
    userId, 
    timeLogId,
    ...updateData
  });
  const calevent = convertTimeLogToCalevent(timeLog, calendarId);
  return calevent;
}

export async function deleteCalevent({
  userId,
  calendarId,
  timeLogId
}:{
  userId: string
  calendarId: CalendarIdType,
  timeLogId: string
}){
  const timeLog = await TimeLog.deleteEvent({
    userId, timeLogId
  });
  const calevent = convertTimeLogToCalevent(timeLog, calendarId);
  return calevent;
}