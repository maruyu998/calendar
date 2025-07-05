import { QuotaIdType } from "../../share/types/quota";
import { QuotaFullType } from "@maruyu/time-sdk";

export function aggregateQuota(
  quotaList:QuotaFullType[], 
  searchKey:string|null
):{purposesText:string, id:QuotaIdType, name:string}[]{
  return quotaList.map(quota=>{
    let purpose = quota.purpose;
    const purposes = new Array<string>();
    while(purpose && typeof purpose === 'object' && 'name' in purpose) {
      purposes.push(purpose.name as string);
      purpose = (purpose as any).parentPurpose;
      if(!purpose) break;
    }
    const purposesText = purposes.reverse().join("/");
    return ({ purposesText, id: quota.id, name: quota.name});
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