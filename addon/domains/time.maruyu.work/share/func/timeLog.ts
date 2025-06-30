import { TimeQuotaType } from "../types/timeQuota";

export function getTimePurposeList(timeQuota:TimeQuotaType):string[]{
  const purposeList = new Array<string>();
  type TimePurposeType = TimeQuotaType["timePurpose"];
  let timePurpose:TimePurposeType|null = timeQuota.timePurpose;
  while(timePurpose){
    purposeList.unshift(timePurpose.name)
    timePurpose = timePurpose.parentPurpose;
  }
  return purposeList;
}

export function createTitle(timeQuota:TimeQuotaType){
  return `[T]${timeQuota.name}<${getTimePurposeList(timeQuota).join("/")}>`;
}