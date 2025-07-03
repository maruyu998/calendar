import { getPacket } from "@ymwc/http"
import { DOMAIN_ENDPOINT } from "../../const";
import { 
  ResponseObjectSchema as FetchListResponseObjectSchema,
  ResponseObjectType as FetchListResponseObjectType,
  RequestQuerySchema as FetchListRequestQuerySchema,
  RequestQueryType as FetchListRequestQueryType,
} from "../../share/protocol/quota/fetchList";

export async function fetchQuotaList(queryData: FetchListRequestQueryType):Promise<FetchListResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/quota/list`, window.location.href);
  const querySchema = FetchListRequestQuerySchema;
  const responseSchema = FetchListResponseObjectSchema;
  return await getPacket({ url, queryData, querySchema, responseSchema })
                .catch(error => {
                  console.error(error);
                  throw error;
                });
}