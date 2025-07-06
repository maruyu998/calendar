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
import { DatafootCalendarSchema } from "../types/calendar";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.post('/item', 
  deserializePacketInBody(),
  requireBodyZod(CreateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { category, title } = response.locals.body as CreateItemRequestBodyType;
    
    const calendarTitle = title || getCalendarTitle(category);
    
    const calendar = await replaceCalendar({
      userId,
      calendarSource: DOMAIN as any,
      uniqueKeyInSource: category as any,
      name: calendarTitle,
      description: getCalendarDescription(category),
      permissions: ["readList", "readItem"] as any,
      style: {
        display: "showInList" as any,
        color: getCalendarColor(category) as any,
      },
      data: { category },
      calendarSchema: DatafootCalendarSchema,
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

function getCalendarTitle(category: string): string {
  switch (category) {
    case "androidAppUsage":
      return "Android App Usage";
    default:
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Calendar`;
  }
}

function getCalendarDescription(category: string): string {
  switch (category) {
    case "androidAppUsage":
      return "Track Android application usage data from Datafoot";
    default:
      return `Monitor ${category} data from Datafoot`;
  }
}

function getCalendarColor(category: string): string {
  switch (category) {
    case "androidAppUsage":
      return "#4CAF50"; // Green
    default:
      return "#9C27B0"; // Purple
  }
}

export default router;