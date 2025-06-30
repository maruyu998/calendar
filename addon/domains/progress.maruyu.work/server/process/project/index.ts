import { getPacket } from 'maruyu-webcommons/commons/utils/fetch';
import { DOMAIN } from "../../../const";
import { FetchListResponseObjectSchema, FetchListResponseObjectType } from "./protocol";
import { getStoredApiKey } from '../connect';
import { ProjectIdType } from "../../../share/types/project";
import { UserIdType } from 'maruyu-webcommons/commons/types/user';
import { FetchListRequestQueryType } from "./protocol";

const ENDPOINT = `https://${DOMAIN}/api/v2/project/full`;

export async function fetchProjectList(props:{
  userId: UserIdType,
  projectId?: ProjectIdType,
}):Promise<FetchListResponseObjectType>{
  const { apiKey } = await getStoredApiKey({ userId: props.userId });
  const url = new URL(`${ENDPOINT}/list`);
  const queryData:FetchListRequestQueryType = {
    parentProjectId: props.projectId,
    statusLabel: null,
    hierarchyPosition: "bottom"
  };
  const option = { accessToken: apiKey };
  const responseSchema = FetchListResponseObjectSchema;
  return await getPacket({ url, queryData, option, responseSchema})
              .then(responseObject=>responseObject as FetchListResponseObjectType)
              .catch(error=>{
                console.error("fetchEventList<in Progress>", error.name, error.message);
                throw error;
              })
}