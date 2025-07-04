import express from "express";
import { requireBodyZod, requireQueryZod } from "@ymwc/node-express";
import { asyncHandler, sendData, sendNoContent } from "@ymwc/node-express";
import { generateConnectUrl, getAndStoreTokenByCode, revokeToken, storeCredential } from "../process/connect";
import * as sync from "../process/sync";

import {
  RequestBodySchema as UpdateCredentialRequestBodySchema,
  RequestBodyType as UpdateCredentialRequestBodyType,
} from "../../share/protocol/setting/updateCredential";
import {
  RequestQuerySchema as TokenRedirectRequestQuerySchema,
  RequestQueryType as TokenRedirectRequestQueryType,
} from "../../share/protocol/setting/tokenRedirect";
import { UserInfoType } from "@server/types/user";

const router = express.Router();

router.post('/refreshList', 
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = response.locals.userInfo as UserInfoType;
    // refresh Google Calendar List
    // https://developers.google.com/calendar/api/v3/reference/events/list
    await sync.refreshCalendarList({userId})
          .then(googleCalendarList=>sendNoContent(response)) // sendData(response, { calendarList }, false);
  })
);

router.put('/credential', 
  requireBodyZod(UpdateCredentialRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = response.locals.userInfo as UserInfoType;
    const { clientId, clientSecret, redirectUri } = response.locals.body as UpdateCredentialRequestBodyType;
    await storeCredential({userId, clientId, clientSecret, redirectUri});
    sendNoContent(response, "added credential successfully.");
  })
);

router.get('/authorizationUrl', 
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = response.locals.userInfo as UserInfoType;
    const authorizationUrl = await generateConnectUrl({userId});
    sendData(response, { authorizationUrl });
  })
);

router.get('/tokenRedirect', 
  requireQueryZod(TokenRedirectRequestQuerySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = response.locals.userInfo as UserInfoType;
    const { code } = response.locals.query as TokenRedirectRequestQueryType;
    await getAndStoreTokenByCode({userId, code});
    sendNoContent(response);
  })
);

router.get('/revokeToken', 
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = response.locals.userInfo as UserInfoType;
    await revokeToken({userId});
    sendNoContent(response, "RevokeTokenSuccess");
  })
);

export default router;