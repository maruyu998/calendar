import express from "express";
import { deserializePacketInBody, requireBodyZod } from "maruyu-webcommons/node/middleware";
import { asyncHandler, sendData, sendNoContent } from "maruyu-webcommons/node/express";
import { storeApiKey } from "../process/connect";

import {
  RequestBodySchema as UpdateCredentialRequestBodySchema,
  RequestBodyType as UpdateCredentialRequestBodyType,
} from "../../share/protocol/setting/apiKey";
import { UserInfoType } from "maruyu-webcommons/node/types/oauth";

const router = express.Router();

router.patch("/apiKey", [
  deserializePacketInBody,
  requireBodyZod(UpdateCredentialRequestBodySchema)
], asyncHandler(async function(request:express.Request, response:express.Response){
  const { userId } = response.locals.userInfo as UserInfoType;
  const { apiKey } = response.locals.body as UpdateCredentialRequestBodyType;
  await storeApiKey({userId, apiKey});
  sendNoContent(response, "store ApiKey successfully.");
}));

export default router;