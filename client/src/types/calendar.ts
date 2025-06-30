import { z } from "zod"
import { ResponseObjectType as FetchListResponseObjectType } from "@share/protocol/calendar/fetchList";
import {
  CalendarIdSchema,
  CalendarIdType,
  CalendarSourceSchema,
  CalendarSourceType,
  CalendarPermissionSchema,
  CalendarStyleDisplaySchema,
  CalendarUniqueKeyInSourceSchema,
  CalendarType,
} from "@share/types/calendar";

import { HexColorSchema, HexColorType } from "maruyu-webcommons/commons/utils/color";

export type { CalendarIdType, CalendarSourceType, CalendarType };
export { CalendarSchema } from "@share/types/calendar";

export function convertFetchListResponseToClient(
  responseObject: FetchListResponseObjectType
):CalendarType[]{
  return responseObject.calendarList;
}