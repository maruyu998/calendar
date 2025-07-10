import express from "express";
import { deserializePacketInBody, deserializePacketInQuery, requireBodyZod, requireQueryZod } from "@ymwc/node-express";
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
import {
  ResponseObjectSchema as ListCalendarsResponseObjectSchema,
  ResponseObjectType as ListCalendarsResponseObjectType,
} from "../../share/protocol/setting/listCalendars";
import {
  RequestBodySchema as UpdateCalendarVisibilityRequestBodySchema,
  RequestBodyType as UpdateCalendarVisibilityRequestBodyType,
  ResponseObjectSchema as UpdateCalendarVisibilityResponseObjectSchema,
  ResponseObjectType as UpdateCalendarVisibilityResponseObjectType,
} from "../../share/protocol/setting/updateCalendarVisibility";
import * as authSdk from "@maruyu/auth-sdk";
import { fetchList as fetchCalendarList, fetchItem as fetchCalendar } from "@server/mongoose/CalendarModel";
import { fetchCalendar as fetchCalendarByIdAndUserId, replaceCalendar } from "@addon/server/calendar";
import { CalendarIdType } from "@share/types/calendar";
import { DOMAIN } from "../../const";
import { GoogleCalendarSchema } from "../types/calendar";

const router = express.Router();

router.post('/refreshList', 
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    // refresh Google Calendar List
    // https://developers.google.com/calendar/api/v3/reference/events/list
    await sync.refreshCalendarList({userId})
          .then(googleCalendarList=>sendNoContent(response)) // sendData(response, { calendarList }, false);
  })
);

router.put('/credential', 
  deserializePacketInBody(),
  requireBodyZod(UpdateCredentialRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { clientId, clientSecret, redirectUri } = response.locals.body as UpdateCredentialRequestBodyType;
    await storeCredential({userId, clientId, clientSecret, redirectUri});
    sendNoContent(response, "added credential successfully.");
  })
);

router.get('/authorizationUrl', 
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const authorizationUrl = await generateConnectUrl({userId});
    sendData(response, { authorizationUrl });
  })
);

router.get('/tokenRedirect', 
  deserializePacketInQuery(),
  requireQueryZod(TokenRedirectRequestQuerySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { code } = response.locals.query as TokenRedirectRequestQueryType;
    await getAndStoreTokenByCode({userId, code});
    sendNoContent(response);
  })
);

router.get('/revokeToken', 
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    await revokeToken({userId});
    sendNoContent(response, "RevokeTokenSuccess");
  })
);

router.get('/calendars', 
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const calendarList = await fetchCalendarList({ userId });
    const googleCalendars = calendarList
      .filter((cal: any) => cal.calendarSource === DOMAIN)
      .map((cal: any) => ({
        id: cal.id,
        name: cal.name,
        description: cal.description,
        googleCalendarId: cal.uniqueKeyInSource,
        timezone: cal.data?.timezone || "",
        accessRole: cal.data?.accessRole || "reader",
        color: cal.style.color,
        display: cal.style.display,
      }));
    
    const responseData: ListCalendarsResponseObjectType = {
      calendars: googleCalendars
    };
    sendData(response, responseData);
  })
);

router.put('/calendar/visibility', 
  deserializePacketInBody(),
  requireBodyZod(UpdateCalendarVisibilityRequestBodySchema),
  asyncHandler(async function(request: express.Request, response: express.Response) {
    const { userId } = authSdk.getUserInfoLocals(response);
    const { calendarId, display } = response.locals.body as UpdateCalendarVisibilityRequestBodyType;
    
    // First fetch the existing calendar to get current values
    const existingCalendar = await fetchCalendarByIdAndUserId({ userId, calendarId: calendarId as CalendarIdType });
    
    // Update the calendar with new visibility
    await replaceCalendar({
      userId,
      calendarSource: existingCalendar.calendarSource,
      uniqueKeyInSource: existingCalendar.uniqueKeyInSource,
      name: existingCalendar.name,
      description: existingCalendar.description,
      permissions: existingCalendar.permissions,
      style: {
        display: display,
        color: existingCalendar.style.color,
      },
      data: existingCalendar.data || {},
      calendarSchema: GoogleCalendarSchema,
    });
    sendNoContent(response);
  })
);

export default router;