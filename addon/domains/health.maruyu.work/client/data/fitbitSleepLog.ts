import { getPacket } from "maruyu-webcommons/commons/utils/fetch";
import { DOMAIN_ENDPOINT } from "../../const";
import {
  ResponseObjectSchema as FetchItemResponseObjectSchema,
  ResponseObjectType as FetchItemResponseObjectType,
  RequestQuerySchema as FetchItemRequestQuerySchema,
  RequestQueryType as FetchItemRequestQueryType,
} from "../../share/protocol/fitbitSleepLog/fetchItem";

export async function fetchFitbitSleepLogItem(queryData: FetchItemRequestQueryType):Promise<FetchItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/fitbitSleepLog/item`, window.location.href);
  const querySchema = FetchItemRequestQuerySchema;
  const responseSchema = FetchItemResponseObjectSchema;
  return await getPacket({ url, queryData, querySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}