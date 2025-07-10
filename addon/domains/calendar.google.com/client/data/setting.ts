import { getPacket, postPacket, putPacket } from "@ymwc/http";
import { DOMAIN_ENDPOINT } from "../../const";
import {
  ResponseObjectSchema as FetchAuthorizationUrlResponseObjectSchema,
  ResponseObjectType as FetchAuthorizationUrlResponseObjectType,
} from "../../share/protocol/setting/fetchAuthorizationUrl";
import {
  RequestBodySchema as UpdateCredentialRequestBodySchema,
  RequestBodyType as UpdateCredentialRequestBodyType,
  ResponseObjectSchema as UpdateCredentialResponseObjectSchema,
  ResponseObjectType as UpdateCredentialResponseObjectType,
} from "../../share/protocol/setting/updateCredential";
import {
  ResponseObjectSchema as RevokeTokenResponseObjectSchema,
  ResponseObjectType as RevokeTokenResponseObjectType,
} from "../../share/protocol/setting/revokeToken";
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

export async function updateCredential(bodyData: UpdateCredentialRequestBodyType):Promise<UpdateCredentialResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/setting/credential`, window.location.href);
  const bodySchema = UpdateCredentialRequestBodySchema;
  const responseSchema = UpdateCredentialResponseObjectSchema;
  return await putPacket({ url, bodyData, bodySchema, responseSchema })
                .catch(error => {
                  console.error(error);
                  throw error;
                });
}

export async function fetchAuthorizationUrl():Promise<FetchAuthorizationUrlResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/setting/authorizationUrl`, window.location.href);
  const responseSchema = FetchAuthorizationUrlResponseObjectSchema;
  return await getPacket({ url, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function revokeToken():Promise<RevokeTokenResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/setting/revokeToken`, window.location.href);
  const responseSchema = RevokeTokenResponseObjectSchema;
  return await postPacket({ url, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function listCalendars():Promise<ListCalendarsResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/setting/calendars`, window.location.href);
  const responseSchema = ListCalendarsResponseObjectSchema;
  return await getPacket({ url, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

export async function updateCalendarVisibility(bodyData: UpdateCalendarVisibilityRequestBodyType):Promise<UpdateCalendarVisibilityResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/setting/calendar/visibility`, window.location.href);
  const bodySchema = UpdateCalendarVisibilityRequestBodySchema;
  const responseSchema = UpdateCalendarVisibilityResponseObjectSchema;
  return await putPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}