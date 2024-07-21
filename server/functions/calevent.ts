import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { CalendarIdType, CalendarMongoType } from "mtypes/v2/Calendar";
import { CalendarModel } from "../mongoose/CalendarModel";
import * as exTimeLogWrapper from "../external/time.maruyu.work/caleventWrapper";
import * as exGcaleventWrapper from "../external/calendar.google.com/caleventWrapper";
import * as exAcaleventWrapper from "../external/aggregator.maruyu.work/caleventWrapper";
import * as exHcaleventWrapper from "../external/health.maruyu.work/caleventWrapper";
import * as exPcaleventWrapper from "../external/people.maruyu.work/caleventWrapper";
import { CaleventIdType, CaleventType } from "mtypes/v2/Calevent";

export async function getList({
  userId,
  userName,
  calendarId,
  startMdate,
  endMdate
}:{
  userId: string,
  userName: string,
  calendarId: CalendarIdType,
  startMdate: Mdate,
  endMdate: Mdate
}):Promise<CaleventType[]>{
  const calendar:CalendarMongoType|null = await CalendarModel.findOne({userId, id:calendarId});
  if(calendar == null) throw new Error(`calendar is not found calendarId=${calendarId}`);

  if(calendar.calendarSource == "calendar.google.com"){
    return await exGcaleventWrapper.fetchCaleventByDateRange({
      userName, calendarId, startMdate, endMdate,
      googleCalendarId: calendar.uniqueKeyInSource,
    });
  }
  if(calendar.calendarSource == "time.maruyu.work"){
    return await exTimeLogWrapper.fetchCalevent({
      userId, calendarId, startMdate, endMdate
    });
  }
  if(calendar.calendarSource == "calendar.maruyu.work"){
    return await exAcaleventWrapper.fetchCalevent({
      userId, userName, calendarId, startMdate, endMdate
    });
  }
  if(calendar.calendarSource == "health.maruyu.work"){
    return await exHcaleventWrapper.fetchCalevent({
      userId, userName, calendarId, startMdate, endMdate
    });
  }
  if(calendar.calendarSource == "people.maruyu.work"){
    return await exPcaleventWrapper.fetchCalevent({
      userId, calendarId, startMdate, endMdate
    });
  }
  throw new Error("not implemented error");
}

export async function addItem({
  userId,
  userName,
  calendarId,
  title,
  startMdate,
  endMdate
}:{
  userId: string,
  userName: string,
  calendarId: CalendarIdType
  title: string,
  startMdate: Mdate,
  endMdate: Mdate
}):Promise<CaleventType>{
  const calendar:CalendarMongoType|null = await CalendarModel.findOne({userId, id:calendarId});
  if(calendar == null) throw new Error("calendar is not found");

  if(calendar.calendarSource == "calendar.google.com"){
    return await exGcaleventWrapper.addCalevent({
      userName, calendarId, title, startMdate, endMdate,
      googleCalendarId: calendar.uniqueKeyInSource,
    })
  }
  if(calendar.calendarSource == "calendar.maruyu.work"){
    throw new Error("writing calendar.maruyu.work is not implemented");
  }
  if(calendar.calendarSource == "time.maruyu.work"){
    return await exTimeLogWrapper.addCalevent({
      userId, calendarId, startMdate, endMdate,
      timeQuotaId: title.trim()
    });
  }
  if(calendar.calendarSource == "health.maruyu.work"){
    throw new Error("writing health.maruyu.work is not implemented and not allowed");
  }
  if(calendar.calendarSource == "people.maruyu.work"){
    return await exPcaleventWrapper.addCalevent({
      userId, calendarId, startMdate, endMdate,
      peopleId: title.trim()
    });
  }
  throw new Error("not implemented error");
}

export async function updateItem({
  userId,
  userName,
  calendarId,
  caleventKey,
  title,
  startMdate,
  endMdate
}:{
  userId: string,
  userName: string,
  calendarId: CalendarIdType,
  caleventKey: string,
  title?: string,
  startMdate?: Mdate,
  endMdate?: Mdate
}):Promise<CaleventType>{
  const calendar:CalendarMongoType|null = await CalendarModel.findOne({userId, id:calendarId});
  if(calendar == null) throw new Error("calendar is not found");

  if(calendar.calendarSource == "calendar.google.com"){
    return await exGcaleventWrapper.updateCalevent({
      userName, calendarId, title, startMdate, endMdate,
      googleCalendarId: calendar.uniqueKeyInSource,
      googleCaleventId: caleventKey
    })
  }
  if(calendar.calendarSource == "calendar.maruyu.work"){
    throw new Error("writing calendar.maruyu.work is not implemented");
  }
  if(calendar.calendarSource == "time.maruyu.work"){
    if(title) throw new Error("time.maruyu.work cannot accept update title.");
    return await exTimeLogWrapper.updateCalevent({
      userId, calendarId, startMdate, endMdate,
      timeLogId: caleventKey
    });
  }
  if(calendar.calendarSource == "health.maruyu.work"){
    throw new Error("writing health.maruyu.work is not implemented and not allowed");
  }
  if(calendar.calendarSource == "people.maruyu.work"){
    if(title) throw new Error("people.maruyu.work cannot accept update title.");
    return await exPcaleventWrapper.updateCalevent({
      userId, calendarId, startMdate, endMdate,
      activityId: caleventKey
    });
  }
  throw new Error("not implemented error");
}

export async function deleteItem({
  userId,
  userName,
  calendarId,
  caleventKey,
}:{
  userId: string,
  userName: string,
  calendarId: CalendarIdType,
  caleventKey: string
}):Promise<CaleventType>{
  const calendar:CalendarMongoType|null = await CalendarModel.findOne({userId, id:calendarId});
  if(calendar == null) throw new Error("calendar is not found");

  if(calendar.calendarSource == "calendar.google.com"){
    return await exGcaleventWrapper.deleteCalevent({
      userName, calendarId,
      googleCalendarId: calendar.uniqueKeyInSource,
      googleCaleventId: caleventKey
    });
  }
  if(calendar.calendarSource == "calendar.maruyu.work"){
    throw new Error("writing calendar.maruyu.work is not implemented");
  }
  if(calendar.calendarSource == "time.maruyu.work"){
    return await exTimeLogWrapper.deleteCalevent({
      userId, calendarId, 
      timeLogId: caleventKey
    });
  }
  if(calendar.calendarSource == "health.maruyu.work"){
    throw new Error("deleting health.maruyu.work is not implemented and not allowed");
  }
  if(calendar.calendarSource == "people.maruyu.work"){
    return await exPcaleventWrapper.deleteCalevent({
      userId, calendarId, 
      activityId: caleventKey
    });
  }
  throw new Error("not implemented error");
}