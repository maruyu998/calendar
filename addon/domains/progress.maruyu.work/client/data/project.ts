import { getPacket } from "maruyu-webcommons/commons/utils/fetch";
import { DOMAIN_ENDPOINT } from "../../const";
import { 
  ResponseObjectSchema as FetchListResponseObjectSchema,
  ResponseObjectType as FetchListResponseObjectType,
  RequestQuerySchema as FetchListRequestQuerySchema,
  RequestQueryType as FetchListRequestQueryType,
} from "../../share/protocol/project/fetchList";

export async function fetchProjectList(queryData: FetchListRequestQueryType):Promise<FetchListResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/project/list`, window.location.href);
  const querySchema = FetchListRequestQuerySchema;
  const responseSchema = FetchListResponseObjectSchema;
  return await getPacket({ url, queryData, querySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}