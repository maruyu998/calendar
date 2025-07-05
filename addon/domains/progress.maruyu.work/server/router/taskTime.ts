import express from "express";
import { asyncHandler, sendData } from "@ymwc/node-express";
import { createTaskTime, deleteTaskTime, fetchTaskTime, updateTaskTime } from "../process/taskTime";
import { deserializePacketInBody, deserializePacketInQuery, requireBodyZod, requireQueryZod } from "@ymwc/node-express";
import { 
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
  ResponseObjectType as FetchItemResponseObjectType
} from "../../share/protocol/taskTime/fetchItem";
import { 
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
  ResponseObjectType as CreateItemResponseObjectType
} from "../../share/protocol/taskTime/createItem";
import { 
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
  ResponseObjectType as UpdateItemResponseObjectType
} from "../../share/protocol/taskTime/updateItem";
import { 
  RequestBodySchema as DeleteItemRequestBodySchema,
  RequestBodyType as DeleteItemRequestBodyType,
  ResponseObjectType as DeleteItemResponseObjectType
} from "../../share/protocol/taskTime/deleteItem";
import {
  convertRawToFetchItemResponseObject,
  convertRawToCreateItemResponseObject,
  convertRawToUpdateItemResponseObject,
  convertRawToDeleteItemResponseObject,
} from "../types/taskTime";
import { fetchCalendar, validateCalendar } from "@addon/server/calendar";
import { ProgressCalendarSchema, ProgressCalendarType } from "../types/calendar";
import { UserInfoType } from "@server/types/user";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.get('/item', 
  deserializePacketInQuery(),
  requireQueryZod(FetchItemRequestQuerySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, ...query } = response.locals.query as FetchItemRequestQueryType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), ProgressCalendarSchema) as ProgressCalendarType;
    await fetchTaskTime({ userId, ...query })
          .then(rawTaskTime=>convertRawToFetchItemResponseObject(rawTaskTime))
          .then((responseObject:FetchItemResponseObjectType)=>sendData(response, responseObject));
  })
);

router.post('/item', 
  deserializePacketInBody(),
  requireBodyZod(CreateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, ...body } = response.locals.body as CreateItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), ProgressCalendarSchema) as ProgressCalendarType;
    await createTaskTime({ userId, ...body })
          .then(rawTaskTime=>convertRawToCreateItemResponseObject(rawTaskTime))
          .then((responseObject:CreateItemResponseObjectType)=>sendData(response, responseObject));
  })
);

router.patch('/item', 
  deserializePacketInBody(),
  requireBodyZod(UpdateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, ...body } = response.locals.body as UpdateItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), ProgressCalendarSchema) as ProgressCalendarType;
    await updateTaskTime({ userId, ...body })
          .then(rawTaskTime=>convertRawToUpdateItemResponseObject(rawTaskTime))
          .then((responseObject:UpdateItemResponseObjectType)=>sendData(response, responseObject));
  })
);

router.delete('/item', 
  deserializePacketInBody(),
  requireBodyZod(DeleteItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, ...body } = response.locals.body as DeleteItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), ProgressCalendarSchema) as ProgressCalendarType;
    await deleteTaskTime({ userId, ...body })
          .then(rawTaskTime=>convertRawToDeleteItemResponseObject(rawTaskTime))
          .then((responseObject:DeleteItemResponseObjectType)=>sendData(response, responseObject));
  })
);

export default router;