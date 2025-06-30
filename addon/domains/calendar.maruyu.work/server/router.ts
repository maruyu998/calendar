import express from "express";

const router = express.Router();

// router.get("/calevent/item", [
//   deserializePacketInQuery,
//   requireQueryZod(FetchItemRequestQuerySchema)
// ], asyncHandler(async function(request: express.Request, response: express.Response) {
//   const { userId } = response.locals.userInfo as UserInfoType;
//   const { calendarId, id } = response.locals.query as FetchItemRequestQueryType;
//   const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), DefaultCalendarSchema) as DefaultCalendarType;
//   await fetchCalevent({ userId, calendarId, id })
//         .then(rawCalevent => convertRawToFetchItemResponseObject(rawCalevent))
//         .then((responseObject: FetchItemResponseObjectType)=>sendData(response, responseObject));
// }));

// router.post("/calevent/item", [
//   deserializePacketInBody,
//   requireBodyZod(CreateItemRequestBodySchema)
// ], asyncHandler(async function(request: express.Request, response: express.Response) {
//   const { userId } = response.locals.userInfo as UserInfoType;
//   const { calendarId, ...body } = response.locals.body as CreateItemRequestBodyType;
//   const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), DefaultCalendarSchema) as DefaultCalendarType;
//   await createCalevent({ userId, calendarId, ...body })
//         .then(rawCalevent => convertRawToCreateItemResponseObject(rawCalevent))
//         .then((responseObject: CreateItemResponseObjectType)=>sendData(response, responseObject));
// }));

// router.patch("/calevent/item", [
//   deserializePacketInBody,
//   requireBodyZod(UpdateItemRequestBodySchema)
// ], asyncHandler(async function(request: express.Request, response: express.Response) {
//   const { userId } = response.locals.userInfo as UserInfoType;
//   const { calendarId, ...body } = response.locals.body as UpdateItemRequestBodyType;
//   const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), DefaultCalendarSchema) as DefaultCalendarType;
//   await updateCalevent({ userId, calendarId, ...body })
//         .then(rawCalevent => convertRawToUpdateItemResponseObject(rawCalevent))
//         .then((responseObject: UpdateItemResponseObjectType)=>sendData(response, responseObject));
// }));

// router.delete("/calevent/item", [
//   deserializePacketInBody,
//   requireBodyZod(DeleteItemRequestBodySchema)
// ], asyncHandler(async function(request: express.Request, response: express.Response) {
//   const { userId } = response.locals.userInfo as UserInfoType;
//   const { calendarId, id } = response.locals.body as DeleteItemRequestBodyType;
//   const calendar = validateCalendar(await fetchCalendar({ userId, calendarId }), DefaultCalendarSchema) as DefaultCalendarType;
//   await deleteCalevent({ userId, calendarId, id })
//         .then(rawCalevent => convertRawToDeleteItemResponseObject(rawCalevent))
//         .then((responseObject: DeleteItemResponseObjectType)=>sendData(response, responseObject));
// }));

export default router;