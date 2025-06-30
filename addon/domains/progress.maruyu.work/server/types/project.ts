import { 
  FetchListResponseObjectType as RawFetchListResponseObjectType,
} from "../process/project/protocol";
import { ResponseObjectType as FetchListResponseObjectType } from "../../share/protocol/project/fetchList";


export function convertRawToFetchListResponseObject(
  raw: RawFetchListResponseObjectType
):FetchListResponseObjectType{
  return raw;
}