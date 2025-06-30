import express from "express";
import { asyncHandler, sendData } from "maruyu-webcommons/node/express";
import { deserializePacketInQuery, requireQueryZod } from "maruyu-webcommons/node/middleware";
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
import { UserInfoType } from "maruyu-webcommons/node/types/oauth";

const router = express.Router();

router.get("/list", [
  deserializePacketInQuery,
  requireQueryZod(FetchListRequestQuerySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
    const { userId } = response.locals.userInfo as UserInfoType;
    const { calendarId, ...query } = response.locals.query as FetchListRequestQueryType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), ProgressCalendarSchema);
    await fetchProjectList({ userId, ...query })
          .then(rawProject=>convertRawToFetchListResponseObject(rawProject))
          .then((responseObject:FetchListResponseObjectType)=>sendData(response, responseObject));
}));

export default router;