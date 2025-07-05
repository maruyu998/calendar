import { QuotaFullType } from "@maruyu/time-sdk";
import { PurposeFullType } from "@maruyu/time-sdk";

export function getPurposeList(quota:QuotaFullType):string[]{
  const purposeList = new Array<string>();
  let purpose:PurposeFullType|null = quota.purpose;
  while(purpose){
    purposeList.unshift(purpose.name);
    purpose = purpose.parentPurpose;
  }
  return purposeList;
}

export function createTitle(quota:QuotaFullType){
  return `[T]${quota.name}<${getPurposeList(quota).join("/")}>`;
}