import express from "express";
import { asyncHandler, sendData, sendError } from "@ymwc/node-express";
import { deserializePacketInBody, deserializePacketInQuery, requireBodyZod, requireQueryZod } from "@ymwc/node-express";
import * as fCalevent from "@server/services/calevent";
import {
  RequestQuerySchema as FetchListRequestQuerySchema,
  RequestQueryType as FetchListRequestQueryType,
  ResponseObjectType as FetchListResponseObjectType,
} from "@share/protocol/calevent/fetchList";
import {
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
  ResponseObjectType as UpdateItemResponseObjectType,
} from "@share/protocol/calevent/updateItem";
import {
  convertRawToFetchListResponseObject,
  convertRawToUpdateItemResponseObject,
} from "@server/types/calevent";
import { UserInfoType } from "@server/types/user";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.get('/list', 
  deserializePacketInQuery(),
  requireQueryZod(FetchListRequestQuerySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { startTime, endTime, calendarIdList } = response.locals.query as FetchListRequestQueryType;
    await Promise.allSettled(calendarIdList.map(calendarId=>fCalevent.fetchList({userId, calendarId, startTime, endTime})))
          // .then(caleventListArray=>caleventListArray.flat())
          .then(results=>results.map(result=>result.status === "fulfilled"?result.value:[]).flat())
          .then(rawCaleventList=>convertRawToFetchListResponseObject(rawCaleventList))
          .then((responseObject:FetchListResponseObjectType)=>sendData(response, responseObject))
  })
);


router.put('/item', 
  deserializePacketInBody(),
  requireBodyZod(UpdateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, caleventId, startTime, endTime } = response.locals.body as UpdateItemRequestBodyType;
    await fCalevent.updateItem({ userId, calendarId, caleventId, startTime, endTime })
          .then(rawCalevent=>convertRawToUpdateItemResponseObject(rawCalevent))
          .then((responseObject:UpdateItemResponseObjectType)=>sendData(response, responseObject));
  })
);

export default router;