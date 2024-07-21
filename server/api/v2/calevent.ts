import express from "express";
import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
import { sendData, sendError, sendMessage } from "maruyu-webcommons/node/express";
import { requireBodyParams, requireQueryParams, requireSignin } from "maruyu-webcommons/node/middleware";
import * as fCalevent from "../../functions/calevent";

const router = express.Router();

router.get("/list", [
  requireSignin,
  requireQueryParams("startUnix", "endUnix", "calendarIds")
], async function(request:express.Request, response:express.Response){
  const { userId, userName } = response.locals.currentUserInfo;
  const { startUnix, endUnix, calendarIds } = response.locals.queries;
  const startMdate = new Mdate(Number(startUnix));
  const endMdate = new Mdate(Number(endUnix));
  const calendarIdList = calendarIds.split(",").filter(cid=>cid!="");
  Promise.all(
    calendarIdList.map(calendarId=>fCalevent.getList({
      userId, userName, calendarId, startMdate, endMdate
    }))
  )
  .then(caleventListArray=>caleventListArray.flat())
  .then(caleventList=>{
    sendData(
      response, 
      "EventList", 
      `getting events with, ${startMdate.toIsoString()}~${endMdate.toIsoString()}, ${caleventList.length} events.`,
      { caleventList },
      false
    );
  })
  .catch(error=>{
    sendError(response, error);
  });
});

router.post('/item', [
  requireSignin,
  requireBodyParams("calendarId", "title", "startUnix", "endUnix")
], async function(request:express.Request, response:express.Response){
  const { userId, userName } = response.locals.currentUserInfo;
  const { calendarId, title, startUnix, endUnix } = response.locals.bodies;
  const startMdate = new Mdate(Number(startUnix));
  const endMdate = new Mdate(Number(endUnix));
  fCalevent.addItem({
    userId, userName, calendarId, title, startMdate, endMdate
  })
  .then(calevent=>{
    sendData(response, "AddEvent", `adding event success.`, { calevent }, false);
  })
  .catch(error=>{
    sendError(response, error);
  })
});

router.put('/item', [
  requireSignin,
  requireBodyParams("calendarId", "caleventKey")
], async function(request:express.Request, response:express.Response){
  const { userId, userName } = response.locals.currentUserInfo;
  const { calendarId, caleventKey } = response.locals.bodies;
  const { title, startUnix, endUnix } = request.body;
  const startMdate = startUnix ? new Mdate(Number(startUnix)) : undefined;
  const endMdate = endUnix ? new Mdate(Number(endUnix)) : undefined;
  fCalevent.updateItem({
    userId, userName, calendarId, caleventKey, title, startMdate, endMdate
  })
  .then(calevent=>{
    sendData(response, "UpdateEvent", `updating event success.`, { calevent }, false);
  })
  .catch(error=>{
    sendError(response, error);
  })
})

router.delete('/item', [
  requireSignin,
  requireBodyParams("calendarId", "caleventKey")
], async function(request:express.Request, response:express.Response){
  const { userId, userName } = response.locals.currentUserInfo;
  const { calendarId, caleventKey } = response.locals.bodies;
  fCalevent.deleteItem({ userId, userName, calendarId, caleventKey })
  .then(calevent=>{
    sendData(response, "DeleteEvent", `deleting event success.`, { calevent }, false);
  })
  .catch(error=>{
    sendError(response, error);
  })
})

export default router;