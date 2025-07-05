import express from "express";
import { asyncHandler, sendData, sendNoContent } from "@ymwc/node-express";
import { fetchLog, fetchLogFull, createLog, updateLog, deleteLog } from "../process/log";
import { deserializePacketInBody, deserializePacketInQuery, requireBodyZod, requireQueryZod } from "@ymwc/node-express";
import { 
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
  ResponseObjectSchema as FetchItemResponseObjectSchema,
} from "../../share/protocol/log/fetchItem";
import { 
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
  ResponseObjectSchema as CreateItemResponseObjectSchema,
} from "../../share/protocol/log/createItem";
import { 
  RequestBodySchema as UpdateItemRequestBodySchema,
  RequestBodyType as UpdateItemRequestBodyType,
  ResponseObjectSchema as UpdateItemResponseObjectSchema,
} from "../../share/protocol/log/updateItem";
import { 
  RequestBodySchema as DeleteItemRequestBodySchema,
  RequestBodyType as DeleteItemRequestBodyType
} from "../../share/protocol/log/deleteItem";
import { LogType, LogFullType } from "@maruyu/time-sdk";
import { fetchCalendar, validateCalendar } from "@addon/server/calendar";
import { TimeCalendarSchema, TimeCalendarType } from "../types/calendar";
import { UserInfoType } from "@server/types/user";

const router = express.Router();

router.get('/item/full',
  deserializePacketInQuery(),
  requireQueryZod(FetchItemRequestQuerySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = response.locals.userInfo as UserInfoType;
    const { calendarId, id } = response.locals.query as FetchItemRequestQueryType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), TimeCalendarSchema) as TimeCalendarType;
    const log = await fetchLogFull({ userId, id });
    sendData(response, FetchItemResponseObjectSchema.parse(log));
  })
);

router.post('/item', 
  deserializePacketInBody(),
  requireBodyZod(CreateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = response.locals.userInfo as UserInfoType;
    const { calendarId, ...body } = response.locals.body as CreateItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), TimeCalendarSchema) as TimeCalendarType;
    const log = await createLog({ userId, ...body });
    sendData(response, CreateItemResponseObjectSchema.parse(log));
  })
);

router.patch('/item', 
  deserializePacketInBody(),
  requireBodyZod(UpdateItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = response.locals.userInfo as UserInfoType;
    const { calendarId, ...body } = response.locals.body as UpdateItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), TimeCalendarSchema) as TimeCalendarType;
    const log = await updateLog({ userId, ...body });
    sendData(response, UpdateItemResponseObjectSchema.parse(log));
  })
);

router.delete('/item', 
  deserializePacketInBody(),
  requireBodyZod(DeleteItemRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = response.locals.userInfo as UserInfoType;
    const { calendarId, id } = response.locals.body as DeleteItemRequestBodyType;
    const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), TimeCalendarSchema) as TimeCalendarType;
    await deleteLog({ userId, id });
    sendNoContent(response);
  })
);

export default router;