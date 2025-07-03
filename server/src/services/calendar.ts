import { CalendarType } from "@share/types/calendar";
import { fetchList as mongoFetchList } from "../mongoose/CalendarModel";
import { UserIdType } from "@server/types/user";

export async function fetchList({
  userId,
}:{
  userId: UserIdType,
}):Promise<CalendarType[]>{
  return await mongoFetchList({ userId });
}