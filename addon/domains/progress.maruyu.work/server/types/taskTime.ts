import { 
  FetchItemResponseObjectType as RawFetchItemResponseObjectType,
  CreateItemResponseObjectType as RawCreateItemResponseObjectType,
  UpdateItemResponseObjectType as RawUpdateItemResponseObjectType,
  DeleteItemResponseObjectType as RawDeleteItemResponseObjectType,
} from "../process/taskTime/protocol";
import { ResponseObjectType as FetchItemResponseObjectType } from "../../share/protocol/taskTime/fetchItem";
import { ResponseObjectType as CreateItemResponseObjectType } from "../../share/protocol/taskTime/createItem";
import { ResponseObjectType as UpdateItemResponseObjectType } from "../../share/protocol/taskTime/updateItem";
import { ResponseObjectType as DeleteItemResponseObjectType } from "../../share/protocol/taskTime/deleteItem";

export function convertRawToFetchItemResponseObject(
  raw: RawFetchItemResponseObjectType
):FetchItemResponseObjectType{
  return raw;
}

export function convertRawToCreateItemResponseObject(
  raw: RawCreateItemResponseObjectType
):CreateItemResponseObjectType{
  return raw;
}

export function convertRawToUpdateItemResponseObject(
  raw: RawUpdateItemResponseObjectType
):UpdateItemResponseObjectType{
  return raw;
}

export function convertRawToDeleteItemResponseObject(
  raw: RawDeleteItemResponseObjectType
):DeleteItemResponseObjectType{
  return raw;
}