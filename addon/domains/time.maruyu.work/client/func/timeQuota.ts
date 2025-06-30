import { TimeQuotaIdType, TimeQuotaType } from "../types/timeQuota";

export function aggregateTimeQuota(
  timeQuotaList:TimeQuotaType[], 
  searchKey:string|null
):{purposesText:string, id:TimeQuotaIdType, name:string}[]{
  return timeQuotaList.map(timeQuota=>{
    let timePurpose = timeQuota.timePurpose;
    const purposes = new Array<string>();
    while(true) {
      purposes.push(timePurpose.name);
      if(timePurpose.parentPurpose == null) break;
      timePurpose = timePurpose.parentPurpose;
    }
    const purposesText = purposes.reverse().join("/");
    return ({ purposesText, id: timeQuota.id, name: timeQuota.name});
  })
  .filter(({purposesText, id, name})=>{
    if(searchKey == null) return true;
    try{
      const regex = new RegExp(searchKey,"gi");
      if(purposesText.match(regex)) return true;
      if(name.match(regex)) return true;
    }catch{
    }
    return false;
  })
  .sort((a,b)=>{
    if(a.purposesText < b.purposesText) return -1;
    if(a.purposesText > b.purposesText) return 1;
    if(a.name < b.name) return -1;
    if(a.name > b.name) return -1;
    return 0;
  })
}