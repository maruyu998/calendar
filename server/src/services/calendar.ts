import { CalendarType } from "@share/types/calendar";
import { fetchList as mongoFetchList } from "../mongoose/CalendarModel";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

export async function fetchList({
  userId,
}:{
  userId: UserIdType,
}):Promise<CalendarType[]>{
  return await mongoFetchList({ userId });
}