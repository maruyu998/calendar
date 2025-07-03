import express from "express";
import { asyncHandler, sendData } from "@ymwc/node-express";
import * as fCalendar from "../../../services/calendar";
import { ResponseObjectType as FetchListResponseObjectType } from "@share/protocol/calendar/fetchList";
import { convertRawToFetchListResponseObject } from "@server/types/calendar";
import { UserInfoType } from "maruyu-webcommons/node/types/oauth";
import { deserializePacketInQuery } from "@ymwc/node-express";

const router = express.Router();

router.get('/list', [
  deserializePacketInQuery,
], asyncHandler(async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.userInfo as UserInfoType;
  await fCalendar.fetchList({userId})
        .then(rawCalendarList=>convertRawToFetchListResponseObject(rawCalendarList))
        .then((responseObject:FetchListResponseObjectType)=>sendData(response, responseObject));
}));

export default router;