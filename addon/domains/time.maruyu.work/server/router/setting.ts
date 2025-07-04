import express from "express";
import { deserializePacketInBody, requireBodyZod } from "@ymwc/node-express";
import { asyncHandler, sendNoContent } from "@ymwc/node-express";
import { storeApiKey } from "../process/connect";

import {
  RequestBodySchema as UpdateCredentialRequestBodySchema,
  RequestBodyType as UpdateCredentialRequestBodyType,
} from "../../share/protocol/setting/apiKey";
import { UserInfoType } from "@server/types/user";

const router = express.Router();

router.patch('/apiKey', 
  deserializePacketInBody(),
  requireBodyZod(UpdateCredentialRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = response.locals.userInfo as UserInfoType;
    const { apiKey } = response.locals.body as UpdateCredentialRequestBodyType;
    await storeApiKey({userId, apiKey});
    sendNoContent(response);
  })
);

export default router;