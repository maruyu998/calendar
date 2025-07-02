import express from "express";
import { asyncHandler, sendData, sendError } from "@ymwc/node-express";
import { requireQueryZod, requireBodyZod, deserializePacketInQuery, deserializePacketInBody } from "maruyu-webcommons/node/middleware";
import { createActivity, deleteActivity, fetchActivity, updateActivity } from "../process/activity";
import {
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
  ResponseObjectType as FetchItemResponseObjectType,
} from "../../share/protocol/activity/fetchItem";
import {
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
  ResponseObjectType as CreateItemResponseObjectType,
} from "../../share/protocol/activity/createItem";
import {
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
  ResponseObjectType as UpdateItemResponseObjectType,
} from "../../share/protocol/activity/updateItem";
import {
  RequestBodySchema as DeleteItemRequestBodySchema,
  RequestBodyType as DeleteItemRequestBodyType,
  ResponseObjectType as DeleteItemResponseObjectType,
} from "../../share/protocol/activity/deleteItem";
import { 
  convertRawToFetchItemResponseObject,
  convertRawToCreateItemResponseObject,
  convertRawToUpdateItemResponseObject,
  convertRawToDeleteItemResponseObject,
} from "../types/activity";
import { PeopleCalendarSchema, PeopleCalendarType } from "../types/calendar";
import { fetchCalendar, validateCalendar } from "@addon/server/calendar";
import { UserInfoType } from "maruyu-webcommons/node/types/oauth";

const router = express.Router()

router.get("/item", [
  deserializePacketInQuery,
  requireQueryZod(FetchItemRequestQuerySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.userInfo as UserInfoType;
  const { calendarId, id } = response.locals.query as FetchItemRequestQueryType;
  const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), PeopleCalendarSchema) as PeopleCalendarType;
  await fetchActivity({ userId, id })
        .then(rawGoogleCalevent=>convertRawToFetchItemResponseObject(rawGoogleCalevent))
        .then((responseObject:FetchItemResponseObjectType)=>sendData(response, responseObject));
}))

router.post("/item", [
  deserializePacketInBody,
  requireBodyZod(CreateItemRequestBodySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.userInfo as UserInfoType;
  const { calendarId, ...body } = response.locals.body as CreateItemRequestBodyType;
  const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), PeopleCalendarSchema) as PeopleCalendarType;
  await createActivity({ userId, ...body })
        .then(rawGoogleCalevent=>convertRawToCreateItemResponseObject(rawGoogleCalevent))
        .then((responseObject:CreateItemResponseObjectType)=>sendData(response, responseObject));
}));

router.put("/item", [
  deserializePacketInBody,
  requireBodyZod(UpdateItemRequestBodySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.userInfo as UserInfoType;
  const { calendarId, ...body } = response.locals.body as UpdateItemRequestBodyType;
  const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), PeopleCalendarSchema) as PeopleCalendarType;
  await updateActivity({ userId, ...body })
        .then(rawGoogleCalevent=>convertRawToUpdateItemResponseObject(rawGoogleCalevent))
        .then((responseObject:UpdateItemResponseObjectType)=>sendData(response, responseObject));
}))

router.delete('/item', [
  deserializePacketInBody,
  requireBodyZod(DeleteItemRequestBodySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.userInfo as UserInfoType;
  const { calendarId, id } = response.locals.body as DeleteItemRequestBodyType;
  const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), PeopleCalendarSchema) as PeopleCalendarType;
  await deleteActivity({ userId, id })
        .then(rawGoogleCalevent=>convertRawToDeleteItemResponseObject(rawGoogleCalevent))
        .then((responseObject:DeleteItemResponseObjectType)=>sendData(response, responseObject));
}))

export default router;