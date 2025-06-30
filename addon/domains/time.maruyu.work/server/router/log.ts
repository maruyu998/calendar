import express from "express";
import { asyncHandler, sendData } from "maruyu-webcommons/node/express";
import { fetchLog, createLog, updateLog, deleteLog } from "../process/log";
import { deserializePacketInBody, deserializePacketInQuery, requireBodyZod, requireQueryZod } from "maruyu-webcommons/node/middleware";
import { 
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
  ResponseObjectType as FetchItemResponseObjectType
} from "../../share/protocol/log/fetchItem";
import { 
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
  ResponseObjectType as CreateItemResponseObjectType
} from "../../share/protocol/log/createItem";
import { 
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
  ResponseObjectType as UpdateItemResponseObjectType
} from "../../share/protocol/log/updateItem";
import { 
  RequestBodySchema as DeleteItemRequestBodySchema,
  RequestBodyType as DeleteItemRequestBodyType,
  ResponseObjectType as DeleteItemResponseObjectType
} from "../../share/protocol/log/deleteItem";
import {
  convertRawToFetchItemResponseObject,
  convertRawToCreateItemResponseObject,
  convertRawToUpdateItemResponseObject,
  convertRawToDeleteItemResponseObject,
} from "../types/log";
import { fetchCalendar, validateCalendar } from "@addon/server/calendar";
import { TimeCalendarSchema, TimeCalendarType } from "../types/calendar";
import { UserInfoType } from "maruyu-webcommons/node/types/oauth";

const router = express.Router();

router.get("/item", [
  deserializePacketInQuery,
  requireQueryZod(FetchItemRequestQuerySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
    const { userId } = response.locals.userInfo as UserInfoType;
    const { calendarId, id } = response.locals.query as FetchItemRequestQueryType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), TimeCalendarSchema) as TimeCalendarType;
    await fetchLog({ userId, id })
          .then(rawTimeLog=>convertRawToFetchItemResponseObject(rawTimeLog))
          .then((responseObject:FetchItemResponseObjectType)=>sendData(response, responseObject))
}));

router.post("/item", [
  deserializePacketInBody,
  requireBodyZod(CreateItemRequestBodySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
    const { userId } = response.locals.userInfo as UserInfoType;
    const { calendarId, ...body } = response.locals.body as CreateItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), TimeCalendarSchema) as TimeCalendarType;
    await createLog({ userId, ...body })
          .then(rawTimeLog=>convertRawToCreateItemResponseObject(rawTimeLog))
          .then((responseObject:CreateItemResponseObjectType)=>sendData(response, responseObject));
}));

router.patch("/item", [
  deserializePacketInBody,
  requireBodyZod(UpdateItemRequestBodySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
    const { userId } = response.locals.userInfo as UserInfoType;
    const { calendarId, ...body } = response.locals.body as UpdateItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), TimeCalendarSchema) as TimeCalendarType;
    await updateLog({ userId, ...body })
          .then(rawTimeLog=>convertRawToUpdateItemResponseObject(rawTimeLog))
          .then((responseObject:UpdateItemResponseObjectType)=>sendData(response, responseObject));
}));

router.delete("/item", [
  deserializePacketInBody,
  requireBodyZod(DeleteItemRequestBodySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
    const { userId } = response.locals.userInfo as UserInfoType;
    const { calendarId, id } = response.locals.body as DeleteItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), TimeCalendarSchema) as TimeCalendarType;
    await deleteLog({ userId, id })
          .then(rawTimeLog=>convertRawToDeleteItemResponseObject(rawTimeLog))
          .then((responseObject:DeleteItemResponseObjectType)=>sendData(response, responseObject));
}));

export default router;