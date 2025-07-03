import express from "express";
import { getUserApiauths, issueApiauth } from "maruyu-webcommons/node/utils/apiauth";
import { asyncHandler, sendData } from "@ymwc/node-express";
import { deserializePacketInBody, deserializePacketInQuery } from "@ymwc/node-express";
import { UserInfoType } from "@server/types/user";

const router = express.Router();

router.get('/list', [
  deserializePacketInQuery,
], asyncHandler(async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.userInfo as UserInfoType;
  await getUserApiauths(userId)
        .then(apiauthList=>sendData(response, { apiauthList }))
}));

router.post('/issue', [
  deserializePacketInBody,
], asyncHandler(async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.userInfo as UserInfoType;
  await issueApiauth(userId)
        .then(apiauth=>sendData(response, { apiauth }));
}))

export default router;