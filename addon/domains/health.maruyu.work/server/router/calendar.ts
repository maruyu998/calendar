import express from "express";
import { asyncHandler, sendData, sendNoContent } from "@ymwc/node-express";
import { requireBodyZod, deserializePacketInBody } from "@ymwc/node-express";
import { replaceCalendar, fetchCalendar, deleteCalendar } from "@addon/server/calendar";
import {
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
  ResponseObjectType as CreateItemResponseObjectType,
} from "../../share/protocol/calendar/createItem";
import {
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
  ResponseObjectType as UpdateItemResponseObjectType,
} from "../../share/protocol/calendar/updateItem";
import {
  RequestBodySchema as DeleteItemRequestBodySchema,
  RequestBodyType as DeleteItemRequestBodyType,
  ResponseObjectType as DeleteItemResponseObjectType,
} from "../../share/protocol/calendar/deleteItem";
import { DOMAIN } from "../../const";
import { HealthCalendarSchema } from "../types/calendar";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.post('/item', 
  deserializePacketInBody(),
  requireBodyZod(CreateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { name, description, color, externalServiceName } = response.locals.body as CreateItemRequestBodyType;
    
    // Generate unique key for health calendar
    const uniqueKey = externalServiceName || `health-${Date.now()}`;
    
    const calendar = await replaceCalendar({
      userId,
      calendarSource: DOMAIN as any,
      uniqueKeyInSource: uniqueKey as any,
      name: name,
      description: description || `Health data calendar for ${name}`,
      permissions: ["readList", "readItem", "writeItem", "editItem", "deleteItem"] as any,
      style: {
        display: "showInList" as any,
        color: color || "#10B981" as any, // Default green for health
      },
      data: { externalServiceName },
      calendarSchema: HealthCalendarSchema,
    });

    const responseObject: CreateItemResponseObjectType = {
      calendar: {
        id: calendar.id,
        name: calendar.name,
        description: calendar.description,
        color: calendar.style.color,
        display: calendar.style.display,
        externalServiceName: calendar.data?.externalServiceName,
      },
    };
    
    sendData(response, responseObject);
  })
);

router.patch('/item', 
  deserializePacketInBody(),
  requireBodyZod(UpdateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, name, description, color, display, externalServiceName } = response.locals.body as UpdateItemRequestBodyType;
    
    // First fetch the existing calendar to get current values
    const existingCalendar = await fetchCalendar({ userId, calendarId });
    
    // Update the calendar with new values
    const calendar = await replaceCalendar({
      userId,
      calendarSource: existingCalendar.calendarSource,
      uniqueKeyInSource: existingCalendar.uniqueKeyInSource,
      name: name || existingCalendar.name,
      description: description || existingCalendar.description,
      permissions: existingCalendar.permissions,
      style: {
        display: display || existingCalendar.style.display,
        color: color || existingCalendar.style.color,
      },
      data: {
        ...existingCalendar.data,
        ...(externalServiceName !== undefined && { externalServiceName }),
      },
      calendarSchema: HealthCalendarSchema,
    });

    const responseObject: UpdateItemResponseObjectType = {
      calendar: {
        id: calendar.id,
        name: calendar.name,
        description: calendar.description,
        color: calendar.style.color,
        display: calendar.style.display,
        externalServiceName: calendar.data?.externalServiceName,
      },
    };
    
    sendData(response, responseObject);
  })
);

// Delete calendar item
router.delete('/item', 
  deserializePacketInBody(),
  requireBodyZod(DeleteItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId } = response.locals.body as DeleteItemRequestBodyType;
    await deleteCalendar({ userId, calendarId });
    sendNoContent(response);
  })
);

export default router;