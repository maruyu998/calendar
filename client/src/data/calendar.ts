import { getPacket } from "maruyu-webcommons/commons/utils/fetch";
import {
  ResponseObjectType as FetchListResponseObjectType,
  ResponseObjectSchema as FetchListResponseObjectSchema,
} from "@share/protocol/calendar/fetchList";

export async function fetchCalendarList(

):Promise<FetchListResponseObjectType>{
  const url = new URL('/sec/apsh/calendar/list', window.location.href);
  const queryData = {};
  const responseSchema = FetchListResponseObjectSchema;
  return await getPacket({url, queryData, responseSchema})
              .catch(error => {
                console.error(error);
                throw error;
              });
}