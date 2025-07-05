import express from "express";
import { asyncHandler, sendData } from "@ymwc/node-express";
import { fetchNightEventItem } from "../process/fitbitSleepLog";
import { deserializePacketInQuery, requireQueryZod } from "@ymwc/node-express";
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
import { UserInfoType } from "@server/types/user";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.get('/item', 
  deserializePacketInQuery(),
  requireQueryZod(FetchItemRequestQuerySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, id } = response.locals.query as FetchItemRequestQueryType;
    const healthCalendar = validateCalendar(await fetchCalendar({ userId, calendarId }), HealthCalendarSchema) as HealthCalendarType;
    await fetchNightEventItem({ userId, id })
          .then(rawNightEvent=>convertRawToFetchItemResponseObject(rawNightEvent))
          .then((responseObject:FetchItemResponseObjectType)=>sendData(response, responseObject));
  })
);

export default router;