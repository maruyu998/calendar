import express from "express";
import { sendData, sendMessage } from "maruyu-webcommons/node/express";
import { requireBodyParams, requireQueryParams, requireSignin } from "maruyu-webcommons/node/middleware";

const router = express.Router();

router.get("", [
  requireSignin,
  requireQueryParams("key")
], async function(request:express.Request, response:express.Response){
  const { key } = response.locals.queries;
  if(request.session.clientData === undefined) request.session.clientData = {}
  const data = request.session.clientData[key]
  sendData(response, "SessionData", key, data, false);
})

router.put("", [
  requireSignin,
  requireBodyParams("key", "data")
], async function(request:express.Request, response:express.Response){
  const { key, data } = response.locals.bodies;
  if(request.session.clientData === undefined) request.session.clientData = {}
  request.session.clientData[key] = data;
  sendMessage(response, "SessionDataSaved", `session ${key} is saved.`, false)
})

export default router;