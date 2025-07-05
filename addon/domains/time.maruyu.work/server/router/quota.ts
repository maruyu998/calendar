import express from "express";
import { asyncHandler, sendData } from "@ymwc/node-express";
import { fetchQuotaFullList } from "../process/quota";
import { deserializePacketInQuery, requireQueryZod } from "@ymwc/node-express";
import { 
  RequestQuerySchema as FetchListRequestQuerySchema,
  RequestQueryType as FetchListRequestQueryType,
} from "../../share/protocol/quota/fetchList";
import { fetchCalendar, validateCalendar } from "@addon/server/calendar";
import { TimeCalendarSchema, TimeCalendarType } from "../types/calendar";
import { UserInfoType } from "@server/types/user";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.get('/list', 
  deserializePacketInQuery(),
  requireQueryZod(FetchListRequestQuerySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId } = response.locals.query as FetchListRequestQueryType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), TimeCalendarSchema) as TimeCalendarType;
    const quotaList = await fetchQuotaFullList({ userId });
    sendData(response, { quotaList });
  })
);

export default router;