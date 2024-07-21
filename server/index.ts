import express from "express";
import path from "path";
import "dotenv/config";
import mconfig from "maruyu-webcommons/node/mconfig";

import apiRouter from "./api/index";

import * as maruyuOAuthClient from "maruyu-webcommons/node/oauth";
import { sendMessage } from "maruyu-webcommons/node/express";
import { PermissionError } from "maruyu-webcommons/node/errors";

import app from "maruyu-webcommons/node/init";
import { requireSignin } from "maruyu-webcommons/node/middleware";
import register from "./register";

const IS_PRODUCTION_MODE = process.env.NODE_ENV==="production";
const PORT = Number(process.env.PORT) || (IS_PRODUCTION_MODE ? Number(process.env.PRODUCTION_PORT) : 3000);
if(!IS_PRODUCTION_MODE && Number(process.env.PORT) === Number(process.env.PRODUCTION_PORT)) throw new Error("PORT determines the same as PRODUCTION_PORT.");

app.use('/manifest.json', express.static(path.join(__dirname, '..', 'client', 'public', 'manifest.json')))
if(IS_PRODUCTION_MODE){
  app.use(mconfig.get("oauthCallbackPath"), maruyuOAuthClient.addCors);
  app.get(mconfig.get("oauthCallbackPath"), maruyuOAuthClient.processCallbackThenRedirect);
  app.use("/api", requireSignin, apiRouter);
  app.get("/signin", maruyuOAuthClient.redirectToSignin);
  app.use(maruyuOAuthClient.redirectIfNotSignedIn);
  app.get("/signout", maruyuOAuthClient.signoutThenRedirectTop);
  app.get("/refresh", maruyuOAuthClient.refreshUserInfo);
  app.use(async (req,res,next)=>{
    await maruyuOAuthClient.getData(req).then((data:{status?:string})=>{
      const message = [
        "Permission required. Please contact application owner to add permission.",
        "Access /signout to signout or /refresh to refresh user info"
      ].join(" ");
      if(data.status !== "approved") throw new PermissionError(message);
      next();
    }).catch((error:Error)=>sendMessage(res, error.name, error.message));
  });
}else{
  app.use("/api", requireSignin, apiRouter);
}
app.use(express.static(path.join(__dirname, "..", "_dist", "public")));

app.listen(PORT, ()=>{
  console.log(`starting: listening port ${PORT}`)
});

register();