import express from "express";
import { asyncHandler, sendData } from "@ymwc/node-express";
import { requireBodyZod, deserializePacketInBody } from "@ymwc/node-express";
import { replaceCalendar } from "@addon/server/calendar";
import {
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
  ResponseObjectType as CreateItemResponseObjectType,
} from "../../share/protocol/calendar/createItem";
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

export default router;