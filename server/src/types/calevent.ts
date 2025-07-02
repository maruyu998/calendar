import {
  ResponseObjectType as FetchListResponseObjectType,
  ResponseObjectSchema as FetchListResponseObjectSchema,
} from "@share/protocol/calevent/fetchList";
import { ResponseObjectType as UpdateItemResponseObjectType } from "@share/protocol/calevent/updateItem";
import { CaleventType } from "@share/types/calevent";
import { InternalServerError } from "@ymwc/errors";
export {
  CaleventPermissionList,
  CaleventStyleDisplayList,
} from "@share/types/calevent";

export function convertRawToFetchListResponseObject(
  raw: CaleventType[],
):FetchListResponseObjectType{
  const responseObject = {
    caleventList: raw.map(calevent=>{
      const { id, calendarId, title, startTime, endTime, permissions, updatedAt, style, data } = calevent;
      return {
        id,
        calendarId,
        title,
        permissions,
        updatedAt,
        style,
        data,
        startTime,
        endTime,
      }
    })
  }
  const { success, error, data: parsedResponseObject } = FetchListResponseObjectSchema.safeParse(responseObject);
  if(!success){
    console.dir(error);
    throw new InternalServerError("Fetch Calevent List Failed, response object does not match the schema.");
  }
  return parsedResponseObject;
}

export function convertRawToUpdateItemResponseObject(
  raw: CaleventType,
):UpdateItemResponseObjectType{
  const { id, calendarId, title, startTime, endTime, permissions, updatedAt, style, data } = raw;
  return {
    calevent: {
      id,
      calendarId,
      title,
      permissions,
      updatedAt,
      style,
      data,
      startTime,
      endTime,
    }
  }
}