import express from 'express';
import mconfig from "maruyu-webcommons/node/mconfig";
import * as connect from '../../../../external/calendar.google.com/connect';
import * as sync from '../../../../external/calendar.google.com/sync';
import * as maruyuOAuthClient from 'maruyu-webcommons/node/oauth';
import { AuthenticationError, PermissionError } from 'maruyu-webcommons/node/errors';
import { sendData, sendError, sendMessage } from 'maruyu-webcommons/node/express';
import { requireBodyParams, requireSignin } from 'maruyu-webcommons/node/middleware';

const router = express.Router()

router.post('/register', [
  requireSignin,
  requireBodyParams("client_id", "client_secret", "redirect_uri")
], async (request:express.Request, response:express.Response) => {
  const { userName } = response.locals.currentUserInfo;
  if(userName !== mconfig.get("providerUserId")){
    return sendMessage(response, "RegisterFailed", "You cannnot register")
  }
  const { client_id, client_secret, redirect_uri } = response.locals.bodies;
  const ret = await connect.registerGrant(client_id, client_secret, redirect_uri);
  sendMessage(response, "RegisterSuccess", `${ret}`)
})

router.get('/grant', [
  requireSignin
], async (request:express.Request, response:express.Response) => {
  const { userName } = response.locals.currentUserInfo;
  if(userName !== mconfig.get("providerUserId")){
    return sendMessage(response, "GrantFailed", "You cannnot make grant")
  }
  const grant_url = await connect.getGrantUrl();
  if(grant_url == null) return response.redirect('/?popup=show_credential');
  sendData(response, "GrantURL", `${grant_url}`, { url: grant_url });
})

router.get('/redirect', async (req, res) => {
  if(!req.query || !req.query.code) return sendMessage(res, "RedirectFailed", "code is requred");
  const userInfo = await maruyuOAuthClient.getUserInfo(req).catch(error=>error);
  if(userInfo instanceof Error) {
    if(userInfo instanceof AuthenticationError) return res.redirect("/signin");
    return sendError(res, new PermissionError("Userinfo is empty"));
  }
  const { userName } = userInfo;
  const code = req.query.code;
  await connect.processRedirect(userName, code)
  res.redirect("/")
})

router.get('/disconnect', async (req, res) => {
  const userInfo = await maruyuOAuthClient.getUserInfo(req).catch(error=>error);
  if(userInfo instanceof Error) {
    if(userInfo instanceof AuthenticationError) return res.redirect("/signin");
    return sendError(res, new PermissionError("Userinfo is empty"));
  }
  const { userName } = userInfo;
  await connect.disconnect(userName).then(ret=>{
    sendMessage(res, "DisconnectSuccessed", "");
  }).catch(error=>{
    if(error.message === "No access token to revoke.")
      sendMessage(res, "DisconnectFailed", 'disconnected fail. connection is not found.')
    else console.error(error)
  })
})

router.get('/refreshCalendarList', [
  requireSignin
], async (request:express.Request, response:express.Response)=>{
  const { userId, userName } = response.locals.currentUserInfo;
  await sync.refreshCalendarList(userId, userName);
  sendMessage(response, "RefreshSuccess", "")
})

// https://developers.google.com/calendar/api/v3/reference/events/list
export default router;