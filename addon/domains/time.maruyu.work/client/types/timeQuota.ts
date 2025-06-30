import { ResponseObjectType as FetchListResponseObjectType } from "../../share/protocol/timeQuota/fetchList";
import { TimeQuotaType } from "../../share/types/timeQuota";
export type { 
  TimeQuotaType,
  TimeQuotaIdType,
} from "../../share/types/timeQuota";

export function convertFetchListResponseToClient(
  responseObject:FetchListResponseObjectType
):TimeQuotaType[]{
  return responseObject.timeQuotaList;
}