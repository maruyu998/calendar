import { TimeZone } from "maruyu-webcommons/commons/utils/mdate";
import * as Birthday from "./process/birthday";
import { CaleventIdType, CaleventType } from "@share/types/calevent";
import { CalendarIdType } from "@share/types/calendar";
import { UserIdType } from "maruyu-webcommons/commons/types/user";


function getNameSummary(people:Birthday.PeopleType):string{
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

function convertBirthdayToCalevent(
  birthday: Birthday.BirthdayType,
  calendarId: CalendarIdType,
):CaleventType{
  return {
    id: `${birthday.people.id}_${birthday.year}` as CaleventIdType,
    calendarId: calendarId,
    // calendarSource: "people.maruyu.work",
    title: `${getNameSummary(birthday.people)}`,
    // description: "",
    startTime: birthday.startTime,
    endTime: birthday.endTime,
    // createdAt: birthday.createdAt,
    updatedAt: birthday.updatedAt,
    permissions: ["read"],
    style: {
      mainColor: null,
      isAllDay: true,
    },
    // display: "show",
    // mainColor: timeLog.timeQuota.styles.color,
    // isDeleted: false,
  };
}

export async function fetchCalevent(props:{
  userId: UserIdType,
  calendarId: CalendarIdType,
  startTime: Date,
  endTime: Date,
  timeZone: TimeZone,
}):Promise<CaleventType[]>{
  const { userId, calendarId, ...body } = props;
  const birthdayList = await Birthday.fetchBirthdayList({userId, ...body});
  const eventList = birthdayList.map(birthday=>(
    convertBirthdayToCalevent(birthday, calendarId)
  ));
  return eventList;
}