import express from "express";
import path from "path";
import "dotenv/config";
import env, { parseList, parseDuration } from "@ymwc/node-env";
import { z } from "zod";
import mongoose from "mongoose";
import { createApp } from "@ymwc/node-app";

import pubRouter from "./api/web_public/index";
import secRouter from "./api/web_secure/index";
import apiRouter from "./api/external/index";

import { asyncHandler, sendError } from "@ymwc/node-express";
import { PermissionError } from "@ymwc/errors";
import * as authSdk from "@maruyu/auth-sdk";
import { requireApiKey } from "@ymwc/node-apikeys";
import * as push from "@ymwc/node-push";
import { setServerTimeZone } from "@ymwc/node-express";
import { TIME_ZONES, TimeZone } from "@ymwc/mdate";
import register from "./register";

const RUN_MODE = env.get("RUN_MODE", z.enum(['development','production','test']));
const port = env.get("PORT", z.coerce.number());
const clientPublicPath = path.join(__dirname, env.get("CLIENT_PUBLIC_PATH", z.string().nonempty()));
setServerTimeZone(env.get("SERVER_TIME_ZONE", z.enum(Object.keys(TIME_ZONES) as [TimeZone, ...TimeZone[]])));

const app = createApp(mongoose, {
  mongoPath: env.get("MONGO_PATH", z.string().startsWith("mongodb://").nonempty()),
  trustProxies: env.get("TRUST_PROXIES", z.string().transform(parseList)),
  trustedSubnets: env.get("TRUSTED_SUBNETS", z.string().transform(parseList)),
  rateLimitWindow: env.get("RATE_LIMIT_WINDOW", z.string().nonempty().transform(parseDuration)),
  rateLimitCount: env.get("RATE_LIMIT_COUNT", z.coerce.number().positive()),
  runMode: RUN_MODE,
  scriptSources: env.get("SCRIPT_SOURCES", z.string().transform(parseList)),
  styleSources: env.get("STYLE_SOURCES", z.string().transform(parseList)),
  fontSources: env.get("FONT_SOURCES", z.string().transform(parseList)),
  frameSources: env.get("FRAME_SOURCES", z.string().transform(parseList)),
  sessionName: env.get("SESSION_NAME", z.string().regex(/^[!#$%&'*+\-.^_`|~0-9a-zA-Z]{1,64}$/)),
  sessionSecret: env.get("SESSION_SECRET", z.string().nonempty()),
  mongoSessionPath: env.get("MONGO_SESSION_PATH", z.string().startsWith("mongodb://").nonempty()),
  mongoSessionCollection: env.get("MONGO_SESSION_COLLECTION", z.string().nonempty()),
  sessionKeepDuration: env.get("SESSION_KEEP_DURATION", z.string().nonempty().transform(parseDuration)),
});

authSdk.register({
  clientId: env.get("CLIENT_ID", z.string().nonempty()),
  clientSecret: env.get("CLIENT_SECRET", z.string().nonempty()),
  oauthDomain: env.get("OAUTH_DOMAIN", z.string().url()),
  oauthInternalDomain: env.get("OAUTH_INTERNAL_DOMAIN", z.string().url()),
  serviceDomain: env.get("SERVICE_DOMAIN", z.string().url()),
  oauthCallbackPath: env.get("OAUTH_CALLBACK_PATH", z.string().startsWith("/")),
  userInfoKeepDuration: env.get("USER_INFO_KEEP_DURATION", z.string().nonempty().transform(parseDuration)),
  authSessionKeepDuration: env.get("AUTH_SESSION_KEEP_DURATION", z.string().nonempty().transform(parseDuration)),
});

app.use('/manifest.json', express.static(path.join(clientPublicPath, 'manifest.json')));
app.use('/favicon.ico', express.static(path.join(clientPublicPath, 'favicon.ico')));
app.use('/robots.txt', express.static(path.join(clientPublicPath, 'robots.txt')));
app.get("/pub/signin", authSdk.redirectToSignin);

console.log({RUN_MODE});
if(RUN_MODE!="test"){
  // AuthServerからのアクセスをCorsに追加する
  app.use(env.get("OAUTH_CALLBACK_PATH",z.string().nonempty()), authSdk.addCors);
  // AuthServerからのリダイレクトを受けてSessionに保存していたURIへリダイレクトする
  app.get(env.get("OAUTH_CALLBACK_PATH",z.string().nonempty()), authSdk.processCallbackThenRedirect);
  app.use("/pub", pubRouter);
  app.use("/api", requireApiKey(), apiRouter);
  
  // リクエスト先のURIをSessionに保存してAuthServerへログインするためにリダイレクトする
  app.use(authSdk.redirectIfNotSignedIn);
  
  app.get("/sec/push", authSdk.requireSignin, asyncHandler(push.sendPublicVapidKey));
  app.post("/sec/push", authSdk.requireSignin, asyncHandler(push.registerSubscription));
  app.delete("/sec/push", authSdk.requireSignin, asyncHandler(push.unregisterSubscription));
  app.get("/sec/signout", authSdk.signout);
  app.get("/sec/refresh", authSdk.refreshUserInfo);
  
  app.use(async (req,res,next)=>{
    await authSdk.getData(req).then((data:{status?:string})=>{
      const message = [
        "Permission required. Please contact application owner to add permission.",
        "Access /sec/signout to signout or /sec/refresh to refresh user info"
      ].join(" ");
      if(data.status !== "approved") throw new PermissionError(message);
      next();
    }).catch((error:Error)=>sendError(res, error));
  });
  app.use("/sec", authSdk.requireSignin, secRouter);
}else{
  app.use((request:express.Request, response:express.Response, next:express.NextFunction)=>{
    response.locals.userInfo = { userId: "tmp" }
    next();
  })
  app.use("/pub", pubRouter);
  app.use("/api", apiRouter);
  
  app.get("/sec/push", asyncHandler(push.sendPublicVapidKey));
  app.post("/sec/push", asyncHandler(push.registerSubscription));
  app.delete("/sec/push", asyncHandler(push.unregisterSubscription));
  app.get("/sec/signout", authSdk.signout);
  app.get("/sec/refresh", authSdk.refreshUserInfo); 
  app.use("/sec", secRouter);
}

app.use("/app", express.static(clientPublicPath));
app.get(/^\/app(\/.*)?$/, (request, response)=>response.sendFile(path.join(clientPublicPath, "index.html")));
app.use((request, response, next) => {
  if(/^\/(app|api|sec|pub)\/.*$/.test(request.path)) return next();
  response.redirect(307, `/app${request.path}`);
});

app.listen(port, ()=>{
  console.log(`starting: listening port ${port}`);
})
register();

declare module "@ymwc/node-push/dist/config" {
  interface PushTypes {
    UserIdBrand: authSdk.UserIdBrandType
  }
}

push.register({
  collectionName: "mwc_pushsubscription",
  publicVapidKey: env.get("PUBLIC_VAPID_KEY", z.string().nonempty()),
  privateVapidKey: env.get("PRIVATE_VAPID_KEY", z.string().nonempty()),
  vapidEmail: env.get("VAPID_EMAIL", z.string().nonempty()),
  getUserId: ({ response }) => response ? authSdk.getUserInfoLocals(response).userId : null
});