import express from "express";
import { sendData } from "maruyu-webcommons/node/express";
import { requireBodyParams, requireSignin } from "maruyu-webcommons/node/middleware";
import * as fCalendar from "../../functions/calendar";
import { CalendarType } from "mtypes/v2/Calendar";

const router = express.Router();

router.get('/list', [
  requireSignin
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const calendarList:CalendarType[] = await fCalendar.getList({userId});
  sendData(response, "CalendarList", `getting calendars success, ${calendarList.length} calendars.`, { calendarList }, false);
});

router.post('/item', [
  requireSignin,
  requireBodyParams(
    "calendarSource","uniqueKeyInSource",
    "name","description","permissions","style","data"
  )
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { 
    calendarSource, uniqueKeyInSource,
    name, description, permissions, style, data
  } = response.locals.bodies;
  const calendarNewData = {
    calendarSource, uniqueKeyInSource,
    name, description, permissions, style, data
  }
  const calendar:CalendarType = await fCalendar.addItem({userId, calendarNewData});
  sendData(response, "CalendarItem", `adding calendars success.`, { calendar });
});

router.put('/item', [
  requireSignin,
  requireBodyParams("calendarId")
], async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.currentUserInfo;
  const { calendarId } = response.locals.bodies;
  const { name, description, permissions, style, data } = request.body;
  const calendarUpdateData = { name, description, permissions, style, data };
  const calendar:CalendarType = await fCalendar.editItem({userId, calendarId, calendarUpdateData});
  sendData(response, "CalendarItem", `adding calendars success.`, { calendar });
});

export default router;