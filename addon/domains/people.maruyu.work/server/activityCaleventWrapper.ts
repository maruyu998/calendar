import * as Activity from "./process/activity";
import { CaleventIdType, CaleventType } from "@share/types/calevent";
import { getNameSummary } from "./utils/people";
import { CalendarIdType } from "@share/types/calendar";
import { PeopleIdType } from "../share/types/people";
import { ActivityIdType } from "../share/types/activity";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

function convertActivityToCalevent(
  activity: Activity.RawActivityType,
  calendarId: CalendarIdType,
):CaleventType{
  return {
    id: activity.id as unknown as CaleventIdType,
    calendarId: calendarId,
    // calendarSource: "people.maruyu.work",
    title: 
      `[P]${activity.title ? activity.title : ""}`
      +`${activity.peopleList.map(people=>(`<${getNameSummary(people.name)}>`)).join("")}`,
    // description:
    //     `Title: ${activity.title??""}\n`
    //     + `url: https://people.maruyu.work/#/people?activityId=${activity.id}\n`
    //     + [...activity.peopleList.map(people=>(
    //       `${getNameSummary(people.name)}: https://people.maruyu.work/#/people?id=${people.id}`
    //     ))].join("\n")
    // ,
    startTime: activity.startTime,
    endTime: activity.endTime,
    // createdAt: activity.createdAt,
    updatedAt: activity.updatedAt,
    permissions: ["read", "write", "edit", "delete"],
    style: {
      // mainColor: timeLog.timeQuota.styles.color
      mainColor: null,
      isAllDay: false,
    }
    // display: "show",
    // isDeleted: false,
  };
}

export async function fetchCalevent({
  userId,
  calendarId,
  startTime,
  endTime
}:{
  userId: UserIdType,
  calendarId: CalendarIdType,
  startTime: Date,
  endTime: Date
}):Promise<CaleventType[]>{
  const activityList = await Activity.fetchActivityList({userId, startTime, endTime});
  const eventList = activityList.map(activity=>(
    convertActivityToCalevent(activity, calendarId)
  ));
  return eventList;
}

export async function createCalevent({
  userId,
  calendarId,
  peopleId,
  startTime,
  endTime
}:{
  userId: UserIdType,
  calendarId: CalendarIdType,
  peopleId: PeopleIdType,
  startTime: Date,
  endTime: Date
}):Promise<CaleventType>{
  const timeLog = await Activity.createActivity({
    userId,
    peopleIdList: [ peopleId ],
    startTime,
    endTime
  });
  const calevent = convertActivityToCalevent(timeLog, calendarId);
  return calevent;
}

export async function updateCalevent({
  userId,
  activityId,
  calendarId,
  startTime,
  endTime
}:{
  userId: UserIdType
  activityId: ActivityIdType,
  calendarId: CalendarIdType,
  startTime?: Date,
  endTime?: Date
}):Promise<CaleventType>{
  const updateData:Record<string,any> = {}
  if(startTime) updateData.startTime = startTime;
  if(endTime) updateData.endTime = endTime;
  const activity = await Activity.updateActivity({
    userId,
    id: activityId,
    ...updateData
  });
  return convertActivityToCalevent(activity, calendarId);
}

export async function deleteCalevent({
  userId,
  calendarId,
  activityId
}:{
  userId: UserIdType
  calendarId: CalendarIdType,
  activityId: ActivityIdType,
}){
  const activity = await Activity.deleteActivity({ userId, id: activityId });
  const calevent = convertActivityToCalevent(activity, calendarId);
  return calevent;
}