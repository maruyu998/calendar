import { QuotaFullType, QuotaFullSchema } from "@maruyu/time-sdk";
import { ResponseObjectType as FetchListResponseObjectType } from "../../share/protocol/quota/fetchList";

export type { QuotaFullType } from "@maruyu/time-sdk";
export { QuotaFullSchema } from "@maruyu/time-sdk";

export function convertFetchListResponseToClient(
  responseObject: FetchListResponseObjectType
): QuotaFullType[] {
  return responseObject.quotaList;
}