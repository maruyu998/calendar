import express from "express";
import { asyncHandler, sendData } from "@ymwc/node-express";
import { fetchAndroidAppUsage } from "../process/androidAppUsage";
import { deserializePacketInQuery, requireQueryZod } from "@ymwc/node-express";
import {
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
  ResponseObjectType as FetchItemResponseObjectType
} from "../../share/protocol/androidAppUsage/fetchItem";
import { fetchCalendar, validateCalendar } from "@addon/server/calendar";
import { DatafootCalendarSchema, DatafootCalendarType } from "../types/calendar";
import { UserInfoType } from "@server/types/user";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.get('/item', 
  deserializePacketInQuery(),
  requireQueryZod(FetchItemRequestQuerySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, id } = response.locals.query as FetchItemRequestQueryType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), DatafootCalendarSchema) as DatafootCalendarType;
    await fetchAndroidAppUsage({ userId, id })
          .then(androidAppUsage=>{
            return {

            } as FetchItemResponseObjectType
          })
          .then(responseObject=>sendData(response, responseObject));
  })
);

export default router;