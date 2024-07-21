import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import * as Activity from "./activity";
import { CalendarIdType } from "mtypes/v2/Calendar";
import { CaleventIdType, CaleventType } from "mtypes/v2/Calevent";


function getNameSummary(people:Activity.PeopleType):string{
  if(people.name.family?.original && people.name.given?.original){
    return `${people.name.family.original}${people.name.given.original}`
  }
  if(people.name.given?.original){
    return `${people.name.given.original}`;
  }
  if(people.name.family?.alphabet && people.name.given?.alphabet){
    return `${people.name.given.original} ${people.name.family.original}`
  }
  if(people.name.nick){
    return people.name.nick;
  }
  return "NoName";
}

function convertActivityToCalevent(
  activity: Activity.ActivityType,
  calendarId: CalendarIdType,
):CaleventType{
  return {
    id: activity.id as CaleventIdType,
    calendarId: calendarId,
    calendarSource: "people.maruyu.work",
    title: 
      `[P]${activity.title ? activity.title : ""}`
      +`${activity.peopleList.map(people=>(`<${getNameSummary(people)}>`)).join("")}`,
    description:
        `Title: ${activity.title??""}\n`
        + `url: https://people.maruyu.work/#/people?activityId=${activity.id}\n`
        + [...activity.peopleList.map(people=>(
          `${getNameSummary(people)}: https://people.maruyu.work/#/people?id=${people.id}`
        ))].join("\n")
    ,
    startTime: activity.startTime,
    endTime: activity.endTime,
    permissions: ["read", "write", "edit", "delete"],
    style: {
      isAllDay: false,
      display: "show",
      // mainColor: timeLog.timeQuota.styles.color
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
  const activityList = await Activity.fetchActivityList({userId, startMdate, endMdate});
  const eventList = activityList.map(activity=>(
    convertActivityToCalevent(activity, calendarId)
  ));
  return eventList;
}

export async function addCalevent({
  userId,
  calendarId,
  peopleId,
  startMdate,
  endMdate
}:{
  userId: string,
  calendarId: CalendarIdType,
  peopleId: string,
  startMdate: Mdate,
  endMdate: Mdate
}):Promise<CaleventType>{
  const timeLog = await Activity.addActivity({
    userId, peopleId, startMdate, endMdate
  });
  const calevent = convertActivityToCalevent(timeLog, calendarId);
  return calevent;
}

export async function updateCalevent({
  userId,
  activityId,
  calendarId,
  startMdate,
  endMdate
}:{
  userId: string
  activityId: string,
  calendarId: CalendarIdType,
  startMdate?: Mdate,
  endMdate?: Mdate
}){
  const updateData:Record<string,any> = {}
  if(startMdate) updateData.startMdate = startMdate;
  if(endMdate) updateData.endMdate = endMdate;
  const activity = await Activity.updateActivity({
    userId, 
    activityId,
    ...updateData
  });
  const calevent = convertActivityToCalevent(activity, calendarId);
  return calevent;
}

export async function deleteCalevent({
  userId,
  calendarId,
  activityId
}:{
  userId: string
  calendarId: CalendarIdType,
  activityId: string
}){
  const activity = await Activity.deleteActivity({
    userId, activityId
  });
  const calevent = convertActivityToCalevent(activity, calendarId);
  return calevent;
}