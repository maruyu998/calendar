import express from "express";
import { asyncHandler, sendData, sendError } from "@ymwc/node-express";
import { deserializePacketInBody, deserializePacketInQuery, requireQueryZod, requireBodyZod } from "@ymwc/node-express";
import { createEvent, deleteEvent, fetchEvent, updateEvent } from "../process/googleCalevent";
import {
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
  ResponseObjectType as FetchItemResponseObjectType,
} from "../../share/protocol/googleCalevent/fetchItem";
import {
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
  ResponseObjectType as CreateItemResponseObjectType,
} from "../../share/protocol/googleCalevent/createItem";
import {
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
  ResponseObjectType as UpdateItemResponseObjectType,
} from "../../share/protocol/googleCalevent/updateItem";
import {
  RequestBodySchema as DeleteItemRequestBodySchema,
  RequestBodyType as DeleteItemRequestBodyType,
  ResponseObjectType as DeleteItemResponseObjectType,
} from "../../share/protocol/googleCalevent/deleteItem";
import {
  convertRawToFetchItemResponseObject,
  convertRawToCreateItemResponseObject,
  convertRawToUpdateItemResponseObject,
  convertRawToDeleteItemResponseObject,
} from "../types/googleCalevent";
import { GoogleCalendarSchema, GoogleCalendarType } from "../types/calendar";
import { fetchCalendar, validateCalendar } from "@addon/server/calendar";
import { UserInfoType } from "@server/types/user";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router()

router.get('/item', 
  deserializePacketInQuery(),
  requireQueryZod(FetchItemRequestQuerySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, eventId } = response.locals.query as FetchItemRequestQueryType;
    const calendar = validateCalendar(await fetchCalendar({userId, calendarId}), GoogleCalendarSchema) as GoogleCalendarType;
    const googleCalendarId = calendar.data.googleCalendarId;
    await fetchEvent({ userId, calendarId: googleCalendarId, eventId })
          .then(rawGoogleCalevent=>convertRawToFetchItemResponseObject(rawGoogleCalevent))
          .then((responseObject:FetchItemResponseObjectType)=>sendData(response, responseObject));
  })
);

router.post('/item', 
  deserializePacketInBody(),
  requireBodyZod(CreateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, ...body } = response.locals.body as CreateItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({userId, calendarId}), GoogleCalendarSchema) as GoogleCalendarType;
    const googleCalendarId = calendar.data.googleCalendarId;
    await createEvent({ userId, calendarId: googleCalendarId, ...body })
          .then(rawGoogleCalevent=>convertRawToCreateItemResponseObject(rawGoogleCalevent))
          .then((responseObject:CreateItemResponseObjectType)=>sendData(response, responseObject));
  })
);

router.put('/item', 
  deserializePacketInBody(),
  requireBodyZod(UpdateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, ...body } = response.locals.body as UpdateItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({userId, calendarId}), GoogleCalendarSchema) as GoogleCalendarType;
    const googleCalendarId = calendar.data.googleCalendarId;
    await updateEvent({ userId, calendarId:googleCalendarId, ...body })
          .then(rawGoogleCalevent=>convertRawToUpdateItemResponseObject(rawGoogleCalevent))
          .then((responseObject:UpdateItemResponseObjectType)=>sendData(response, responseObject));
  })
);

router.delete('/item', 
  deserializePacketInBody(),
  requireBodyZod(DeleteItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, eventId } = response.locals.body as DeleteItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({userId, calendarId}), GoogleCalendarSchema) as GoogleCalendarType;
    const googleCalendarId = calendar.data.googleCalendarId;
    await deleteEvent({ userId, calendarId:googleCalendarId, eventId })
          .then(rawGoogleCalevent=>convertRawToDeleteItemResponseObject(rawGoogleCalevent))
          .then((responseObject:DeleteItemResponseObjectType)=>sendData(response, responseObject));
  })
);

export default router;