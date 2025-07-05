import express from "express";
import { asyncHandler, sendData } from "@ymwc/node-express";
import * as fCalendar from "../../../services/calendar";
import { ResponseObjectType as FetchListResponseObjectType } from "@share/protocol/calendar/fetchList";
import { convertRawToFetchListResponseObject } from "@server/types/calendar";
import { UserInfoType } from "@server/types/user";
import { deserializePacketInQuery } from "@ymwc/node-express";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.get('/list', 
  deserializePacketInQuery(),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    await fCalendar.fetchList({userId})
          .then(rawCalendarList=>convertRawToFetchListResponseObject(rawCalendarList))
          .then((responseObject:FetchListResponseObjectType)=>sendData(response, responseObject));
  })
);

export default router;