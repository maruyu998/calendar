import express from "express";
import { deserializePacketInBody, requireBodyZod, requireQueryZod } from "maruyu-webcommons/node/middleware";
import { asyncHandler, sendData, sendError, sendNoContent } from "@ymwc/node-express";
import { storeApiKey } from "../process/connect";
import { updateItem as mongoUpdateItem } from "@server/mongoose/CalendarModel";
import { DOMAIN } from "../../const";
import { CalendarSourceType, CalendarUniqueKeyInSourceType } from "@share/types/calendar";
import { HexColorType } from "@ymwc/utils";

import {
  RequestBodySchema as UpdateCredentialRequestBodySchema,
  RequestBodyType as UpdateCredentialRequestBodyType,
} from "../../share/protocol/setting/apiKey";
import { UserInfoType } from "maruyu-webcommons/node/types/oauth";

const router = express.Router();

router.put("/apiKey", [
  deserializePacketInBody,
  requireBodyZod(UpdateCredentialRequestBodySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.userInfo as UserInfoType;
  const { apiKey } = response.locals.body as UpdateCredentialRequestBodyType;
  await storeApiKey({userId, apiKey});
  
  // Create calendar for Datafoot Android App Usage
  await mongoUpdateItem({
    userId,
    calendarSource: DOMAIN as CalendarSourceType,
    uniqueKeyInSource: "androidAppUsage" as CalendarUniqueKeyInSourceType,
    name: "Android App Usage",
    description: "Android application usage tracking from Datafoot",
    permissions: ["readList", "readItem"],
    style: {
      display: "showInList",
      color: "#4CAF50" as HexColorType,
    },
    data: {
      category: "androidAppUsage"
    }
  });
  
  return sendNoContent(response, "store ApiKey successfully.");
}));

export default router;