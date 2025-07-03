import { putPacket } from "@ymwc/http";
import { DOMAIN_ENDPOINT } from "../../const";
import { 
  RequestBodySchema,
  RequestBodyType,
  ResponseObjectSchema,
  ResponseObjectType
} from "../../share/protocol/setting/apiKey";

export async function updateApiKey(bodyData: RequestBodyType):Promise<ResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/setting/apiKey`, window.location.href);
  const bodySchema = RequestBodySchema;
  const responseSchema = ResponseObjectSchema;
  return await putPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}