import { ResponseObjectType as FetchListResponseObjectType } from "../../share/protocol/quota/fetchList";
import { QuotaType } from "../../share/types/quota";

export function convertFetchListResponseToClient(
  responseObject:FetchListResponseObjectType
):QuotaType[]{
  return responseObject.quotaList;
}