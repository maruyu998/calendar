import express from "express";
import { getUserApiauths, issueApiauth } from "@ymwc/node-apikeys";
import { asyncHandler, sendData } from "@ymwc/node-express";
import { deserializePacketInBody, deserializePacketInQuery } from "@ymwc/node-express";
import { UserInfoType } from "@server/types/user";
import * as authSdk from "@maruyu/auth-sdk";

const router = express.Router();

router.get('/list', 
  deserializePacketInQuery(),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    await getUserApiauths(userId)
          .then(apiauthList=>sendData(response, { apiauthList }))
  })
);

router.post('/issue', 
  deserializePacketInBody(),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    await issueApiauth(userId)
          .then(apiauth=>sendData(response, { apiauth }));
  })
);

export default router;