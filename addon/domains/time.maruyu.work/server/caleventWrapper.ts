import * as Log from "./process/log";
import { CalendarIdType } from "@share/types/calendar";
import { CaleventIdType, CaleventType } from "@share/types/calevent";
import { DOMAIN } from "../const";
import { createTitle } from "../share/func/log";
import { LogIdType, LogFullType } from "../share/types/log";
import { UserIdType } from "@server/types/user";

export function convertLogToCalevent(
  log: LogFullType,
  calendarId: CalendarIdType,
):CaleventType{
  return {
    id: log.id as unknown as CaleventIdType,
    calendarId: calendarId,
    title: createTitle(log.quota),
    startTime: log.startTime,
    endTime: log.endTime,
    updatedAt: log.updatedTime,
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
  const logFull = await Log.fetchLogFull({ userId, id });
  const calevent = convertLogToCalevent(logFull, calendarId);
  return calevent;
}