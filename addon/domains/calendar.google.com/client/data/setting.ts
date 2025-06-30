import { getPacket, postPacket, patchPacket } from "maruyu-webcommons/commons/utils/fetch";
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

export async function updateCredential(bodyData: UpdateCredentialRequestBodyType):Promise<UpdateCredentialResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/setting/credential`, window.location.href);
  const bodySchema = UpdateCredentialRequestBodySchema;
  const responseSchema = UpdateCredentialResponseObjectSchema;
  return await patchPacket({ url, bodyData, bodySchema, responseSchema })
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