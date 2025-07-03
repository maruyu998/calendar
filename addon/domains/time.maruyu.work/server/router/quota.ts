import express from "express";
import { asyncHandler, sendData } from "@ymwc/node-express";
import { fetchQuotaList } from "../process/quota";
import { deserializePacketInQuery, requireQueryZod } from "@ymwc/node-express";
import { 
  RequestQuerySchema as FetchListRequestQuerySchema,
  RequestQueryType as FetchListRequestQueryType,
} from "../../share/protocol/quota/fetchList";
import { fetchCalendar, validateCalendar } from "@addon/server/calendar";
import { TimeCalendarSchema, TimeCalendarType } from "../types/calendar";
import { UserInfoType } from "maruyu-webcommons/node/types/oauth";

const router = express.Router();

router.get("/list", [
  deserializePacketInQuery,
  requireQueryZod(FetchListRequestQuerySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
    const { userId } = response.locals.userInfo as UserInfoType;
    const { calendarId } = response.locals.query as FetchListRequestQueryType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), TimeCalendarSchema) as TimeCalendarType;
    await fetchQuotaList({ userId })
          .then(timeQuotaList=>sendData(response, { timeQuotaList }))
}))

export default router;