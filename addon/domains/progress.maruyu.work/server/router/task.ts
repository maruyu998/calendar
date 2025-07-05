import express from "express";
import { asyncHandler, sendData } from "@ymwc/node-express";
import { deserializePacketInBody, deserializePacketInQuery, requireBodyZod, requireQueryZod } from "@ymwc/node-express";
import { createTask, fetchTaskList } from "../process/task";
import { 
  RequestQuerySchema as FetchListRequestQuerySchema,
  RequestQueryType as FetchListRequestQueryType,
  ResponseObjectType as FetchListResponseObjectType
} from "../../share/protocol/task/fetchList";
import { 
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
  ResponseObjectType as CreateItemResponseObjectType
} from "../../share/protocol/task/createItem";
import {
  convertRawToFetchListResponseObject,
  convertRawToCreateItemResponseObject,
} from "../types/task";
import { fetchCalendar, validateCalendar } from "@addon/server/calendar";
import { ProgressCalendarSchema, ProgressCalendarType } from "../types/calendar";
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
    await fetchTaskList({ userId, ...query })
          .then(rawTask=>convertRawToFetchListResponseObject(rawTask))
          .then((responseObject:FetchListResponseObjectType)=>sendData(response, responseObject));
  })
);

router.post('/item', 
  deserializePacketInBody(),
  requireBodyZod(CreateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, ...body } = response.locals.body as CreateItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), ProgressCalendarSchema) as ProgressCalendarType;
    await createTask({ userId, ...body })
          .then(rawTask=>convertRawToCreateItemResponseObject(rawTask))
          .then((responseObject:CreateItemResponseObjectType)=>sendData(response, responseObject));
  })
);

export default router;