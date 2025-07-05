import * as timeSdk from '@maruyu/time-sdk';
import { getStoredApiKey } from './connect';
import { UserIdType } from '@server/types/user';

export async function fetchQuotaFullList(props:{
  userId: UserIdType,
}):Promise<timeSdk.QuotaFullType[]>{
  const { userId } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const result = await timeSdk.fetchQuotaListFull(apiKey, {});
  return result.quotaList;
}