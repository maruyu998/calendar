import express from "express";
import { asyncHandler, sendData } from "maruyu-webcommons/node/express";
import { fetchNightEventItem } from "../process/fitbitSleepLog";
import { requireQueryZod } from "maruyu-webcommons/node/middleware";
import { 
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
  ResponseObjectType as FetchItemResponseObjectType
} from "../../share/protocol/fitbitSleepLog/fetchItem";
import {
  convertRawToFetchItemResponseObject,
} from "../types/fitbitSleepLog";
import { fetchCalendar, validateCalendar } from "@addon/server/calendar";
import { HealthCalendarSchema, HealthCalendarType } from "../types/calendar";
import { UserInfoType } from "maruyu-webcommons/node/types/oauth";

const router = express.Router();

router.get("/item", [
  requireQueryZod(FetchItemRequestQuerySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
    const { userId } = response.locals.userInfo as UserInfoType;
    const { calendarId, id } = response.locals.query as FetchItemRequestQueryType;
    const healthCalendar = validateCalendar(await fetchCalendar({ userId, calendarId }), HealthCalendarSchema) as HealthCalendarType;
    await fetchNightEventItem({ userId, id })
          .then(rawNightEvent=>convertRawToFetchItemResponseObject(rawNightEvent))
          .then((responseObject:FetchItemResponseObjectType)=>sendData(response, responseObject));
}));

export default router;