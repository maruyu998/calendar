import { getPacket } from '@ymwc/http';
import { DOMAIN } from "../../const";
import { QuotaType } from "../../share/types/quota";
import { getStoredApiKey } from './connect';
import { UserIdType } from 'maruyu-webcommons/commons/types/user';

export async function fetchQuotaList(props:{
  userId: UserIdType,
}):Promise<QuotaType[]>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/quota/list`);
  const option = { accessToken: apiKey };
  return await getPacket({ url, queryData, option })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("quotaList" in (data as object))) throw new Error("quotaList is not found");
                const quotaList = (data as { quotaList: QuotaType[] }).quotaList;
                return quotaList;
              })
              .catch(e=>{
                console.error("fetchEvent<in Time>", e);
                return new Array<QuotaType>();
              })
}