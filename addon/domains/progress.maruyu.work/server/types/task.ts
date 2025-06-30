import { ResponseObjectType as FetchListResponseObjectType } from "../../share/protocol/task/fetchList";
import { ResponseObjectType as CreateItemResponseObjectType } from "../../share/protocol/task/createItem";
import { TaskWithFullType } from "../../share/types/task";

export function convertRawToFetchListResponseObject(
  raw: FetchListResponseObjectType
):FetchListResponseObjectType{
  return raw;
}

export function convertRawToCreateItemResponseObject(
  raw: CreateItemResponseObjectType
):CreateItemResponseObjectType{
  return raw;
}