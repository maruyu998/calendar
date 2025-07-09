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
import { TimeCalendarSchema } from "../types/calendar";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.post('/item', 
  deserializePacketInBody(),
  requireBodyZod(CreateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { category, title } = response.locals.body as CreateItemRequestBodyType;
    
    const calendarTitle = title || `${category.charAt(0).toUpperCase() + category.slice(1)} Calendar`;
    
    const calendar = await replaceCalendar({
      userId,
      calendarSource: DOMAIN as any,
      uniqueKeyInSource: category as any,
      name: calendarTitle,
      description: `Time tracking calendar for ${category}`,
      permissions: ["readList", "readItem", "writeItem", "editItem", "deleteItem"] as any,
      style: {
        display: "showInList" as any,
        color: "#3B82F6" as any,
      },
      data: { category },
      calendarSchema: TimeCalendarSchema,
    });

    const responseObject: CreateItemResponseObjectType = {
      calendar: {
        id: calendar.id,
        title: calendar.name,
        domain: calendar.calendarSource,
        isEnabled: true, // Derived from style.display
        data: calendar.data,
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
    const { calendarId, name, description, color, display } = response.locals.body as UpdateItemRequestBodyType;
    
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
      data: existingCalendar.data || {},
      calendarSchema: TimeCalendarSchema,
    });

    const responseObject: UpdateItemResponseObjectType = {
      calendar: {
        id: calendar.id,
        name: calendar.name,
        description: calendar.description,
        color: calendar.style.color,
        display: calendar.style.display,
        data: calendar.data,
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