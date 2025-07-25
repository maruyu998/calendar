import express from "express";
import { asyncHandler, sendData } from "@ymwc/node-express";
import { deserializePacketInQuery, requireQueryZod } from "@ymwc/node-express";
import { fetchProjectList } from "../process/project";
import { 
  RequestQuerySchema as FetchListRequestQuerySchema,
  RequestQueryType as FetchListRequestQueryType,
  ResponseObjectType as FetchListResponseObjectType
} from "../../share/protocol/project/fetchList";
import {
  convertRawToFetchListResponseObject,
} from "../types/project";
import { fetchCalendar, validateCalendar } from "@addon/server/calendar";
import { ProgressCalendarSchema } from "../types/calendar";
import { UserInfoType } from "@server/types/user";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.get('/list', 
  deserializePacketInQuery(),
  requireQueryZod(FetchListRequestQuerySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, ...query } = response.locals.query as FetchListRequestQueryType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), ProgressCalendarSchema);
    await fetchProjectList({ userId, ...query })
          .then(rawProject=>convertRawToFetchListResponseObject(rawProject))
          .then((responseObject:FetchListResponseObjectType)=>sendData(response, responseObject));
  })
);

export default router;