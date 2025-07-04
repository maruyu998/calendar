import * as Log from "./process/log";
import { CalendarIdType } from "@share/types/calendar";
import { CaleventIdType, CaleventType } from "@share/types/calevent";
import { DOMAIN } from "../const";
import { createTitle } from "../share/func/log";
import { LogIdType } from "../share/types/log";
import { LogApiType } from "./types/log";
import { UserIdType } from "@server/types/user";

export function convertLogToCalevent(
  log: LogApiType,
  calendarId: CalendarIdType,
):CaleventType{
  return {
    id: log.id as unknown as CaleventIdType,
    calendarId: calendarId,
    // calendarSource: DOMAIN,
    title: createTitle(log.quota),
    // description:
    //     `url: https://${DOMAIN}/?logId=${log.id}\n`
    //   + `TimeQuotaId: ${log.quota.id}\n`
    //   + `Purposes: ${timePurposeList.join("/")}\n\n`
    //   + (log.output ? `<output>\n${log.output}\n\n` : "") 
    //   + (log.review ? `<review>\n${log.review}` : ""),
    startTime: log.startTime,
    endTime: log.endTime,
    // createdAt: log.createdAt,
    updatedAt: log.updatedAt,
    permissions: ["read", "write", "edit", "delete"],
    style: {
      mainColor: log.quota.styles.color,
      isAllDay: false,
    },
    // display: "show",
    // isDeleted: false,
  };
}

export async function fetchCalevent(props:{
  userId: UserIdType,
  calendarId: CalendarIdType
  startTime: Date,
  endTime: Date
}):Promise<CaleventType[]>{
  const { userId, calendarId, ...body } = props;
  const logList = await Log.fetchLogList({userId, ...body});
  const eventList = logList.map(log=>(
    convertLogToCalevent(log, calendarId)
  ));
  return eventList;
}

export async function updateCalevent(props:{
  userId: UserIdType
  logId: LogIdType,
  calendarId: CalendarIdType,
  startTime?: Date,
  endTime?: Date,
}):Promise<CaleventType>{
  const { userId, calendarId, logId: id, ...updateData } = props;
  const log = await Log.updateLog({ userId, id, ...updateData });
  // updateLogはLogを返すので、LogFullに変換するためにfetchLogを使う
  const fullLog = await Log.fetchLog({ userId, id });
  const calevent = convertLogToCalevent(fullLog, calendarId);
  return calevent;
}