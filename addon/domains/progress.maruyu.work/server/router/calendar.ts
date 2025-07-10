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
import { ProgressCalendarSchema } from "../types/calendar";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.post('/item', 
  deserializePacketInBody(),
  requireBodyZod(CreateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { name, description } = response.locals.body as CreateItemRequestBodyType;
    
    // Generate unique key for progress calendar
    const uniqueKey = `progress-${Date.now()}`;
    
    const calendar = await replaceCalendar({
      userId,
      calendarSource: DOMAIN as any,
      uniqueKeyInSource: uniqueKey as any,
      name: name,
      description: description || `Progress tracking calendar for ${name}`,
      permissions: ["readList", "readItem", "writeItem", "editItem", "deleteItem"] as any,
      style: {
        display: "showInList" as any,
        color: "#3B82F6" as any, // Default blue for progress
      },
      data: {},
      calendarSchema: ProgressCalendarSchema,
    });

    const responseData: CreateItemResponseObjectType = {
      data: {
        created: ProgressCalendarSchema.parse(calendar),
      },
    };

    sendData(response, responseData);
  })
);

router.patch('/item',
  deserializePacketInBody(),
  requireBodyZod(UpdateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, name, description, style } = response.locals.body as UpdateItemRequestBodyType;

    const existingCalendar = await fetchCalendar({
      userId,
      calendarId,
    });

    if (!existingCalendar) {
      throw new Error("Calendar not found");
    }

    const calendar = await replaceCalendar({
      userId,
      calendarSource: DOMAIN as any,
      uniqueKeyInSource: existingCalendar.uniqueKeyInSource,
      name: name ?? existingCalendar.name,
      description: description ?? existingCalendar.description,
      permissions: existingCalendar.permissions,
      style: style ? {
        ...existingCalendar.style,
        ...style,
      } : existingCalendar.style,
      data: existingCalendar.data || {},
      calendarSchema: ProgressCalendarSchema,
    });

    const responseData: UpdateItemResponseObjectType = {
      data: {
        updated: ProgressCalendarSchema.parse(calendar),
      },
    };

    sendData(response, responseData);
  })
);

router.delete('/item',
  deserializePacketInBody(),
  requireBodyZod(DeleteItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId } = response.locals.body as DeleteItemRequestBodyType;

    await deleteCalendar({
      userId,
      calendarId,
    });

    const responseData: DeleteItemResponseObjectType = {
      data: {
        deleted: true,
      },
    };

    sendData(response, responseData);
  })
);

export default router;