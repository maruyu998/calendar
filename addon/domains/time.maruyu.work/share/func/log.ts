import { QuotaType } from "../types/quota";

export function getPurposeList(quota:QuotaType):string[]{
  const purposeList = new Array<string>();
  type PurposeType = QuotaType["purpose"];
  let purpose:PurposeType|null = quota.purpose;
  while(purpose){
    purposeList.unshift(purpose.name)
    purpose = purpose.parentPurpose;
  }
  return purposeList;
}

export function createTitle(quota:QuotaType){
  return `[T]${quota.name}<${getPurposeList(quota).join("/")}>`;
}