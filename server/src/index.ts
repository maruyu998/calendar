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

import * as maruyuOAuthClient from "maruyu-webcommons/node/utils/oauth";
import { asyncHandler, sendError } from "@ymwc/node-express";
import { PermissionError } from "@ymwc/errors";
import { requireApiKey, requireSignin } from "maruyu-webcommons/node/middleware";
import * as pushUtils from "maruyu-webcommons/node/push";
import register from "./register";

const RUN_MODE = env.get("RUN_MODE", z.enum(['development','production','test']));
const port = env.get("PORT", z.coerce.number());
const clientPublicPath = path.join(__dirname, env.get("CLIENT_PUBLIC_PATH", z.string().nonempty()));

// @ymwc/node-app設定
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

app.use('/manifest.json', express.static(path.join(clientPublicPath, 'manifest.json')));
app.use('/favicon.ico', express.static(path.join(clientPublicPath, 'favicon.ico')));
app.use('/robots.txt', express.static(path.join(clientPublicPath, 'robots.txt')));
app.get("/pub/signin", maruyuOAuthClient.redirectToSignin);

console.log({RUN_MODE});
if(RUN_MODE!="test"){
  // AuthServerからのアクセスをCorsに追加する
  app.use(env.get("OAUTH_CALLBACK_PATH",z.string().nonempty()), maruyuOAuthClient.addCors);
  // AuthServerからのリダイレクトを受けてSessionに保存していたURIへリダイレクトする
  app.get(env.get("OAUTH_CALLBACK_PATH",z.string().nonempty()), maruyuOAuthClient.processCallbackThenRedirect);
  app.use("/pub", pubRouter);
  app.use("/api", requireApiKey(), apiRouter);
  
  // リクエスト先のURIをSessionに保存してAuthServerへログインするためにリダイレクトする
  app.use(maruyuOAuthClient.redirectIfNotSignedIn);
  
  app.get("/sec/push", requireSignin, pushUtils.sendPublicVapidKey);
  app.post("/sec/push", requireSignin, asyncHandler(pushUtils.registerSubscription));
  app.delete("/sec/push", requireSignin, asyncHandler(pushUtils.unregisterSubscription));
  app.get("/sec/signout", maruyuOAuthClient.signout);
  app.get("/sec/refresh", maruyuOAuthClient.refreshUserInfo);
  
  app.use(async (req,res,next)=>{
    await maruyuOAuthClient.getData(req).then((data:{status?:string})=>{
      const message = [
        "Permission required. Please contact application owner to add permission.",
        "Access /sec/signout to signout or /sec/refresh to refresh user info"
      ].join(" ");
      if(data.status !== "approved") throw new PermissionError(message);
      next();
    }).catch((error:Error)=>sendError(res, error));
  });
  app.use("/sec", requireSignin, secRouter);
}else{
  app.use((request:express.Request, response:express.Response, next:express.NextFunction)=>{
    response.locals.userInfo = { userId: "tmp" }
    next();
  })
  app.use("/pub", pubRouter);
  app.use("/api", apiRouter);
  
  app.get("/sec/push", pushUtils.sendPublicVapidKey);
  app.post("/sec/push", asyncHandler(pushUtils.registerSubscription));
  app.delete("/sec/push", asyncHandler(pushUtils.unregisterSubscription));
  app.get("/sec/signout", maruyuOAuthClient.signout);
  app.get("/sec/refresh", maruyuOAuthClient.refreshUserInfo); 
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
pushUtils.register();