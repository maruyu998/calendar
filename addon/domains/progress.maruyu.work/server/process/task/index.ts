import { getPacket, postPacket } from 'maruyu-webcommons/commons/utils/fetch';
import { DOMAIN } from "../../../const";
import {
  FetchListResponseObjectSchema, FetchListResponseObjectType,
  CreateItemResponseObjectSchema, CreateItemResponseObjectType, 
} from "./protocol";
import { getStoredApiKey } from '../connect';
import { ProjectIdType, ProjectSchema } from "../../../share/types/project";
import { OutcomeIdType } from '../../../share/types/outcome';
import { TaskPriorityType, TaskRecurringIdType } from '../../../share/types/task';
import { HexColorType } from 'maruyu-webcommons/commons/utils/color';
import { UserIdType } from 'maruyu-webcommons/commons/types/user';
import { FetchListRequestQueryType } from "./protocol";

const ENDPOINT = `https://${DOMAIN}/api/v2/task`;

export async function fetchTaskList(props:{
  userId: UserIdType,
  projectId?: ProjectIdType,
}):Promise<FetchListResponseObjectType>{
  const { apiKey } = await getStoredApiKey({ userId: props.userId });
  const url = new URL(`${ENDPOINT}/full/list`);
  const queryData:FetchListRequestQueryType = {
    projectId: props.projectId,
    statusLabel: null,
  }
  const option = { accessToken: apiKey };
  const responseSchema = FetchListResponseObjectSchema;
  return await getPacket({ url, queryData, option, responseSchema })
              .then(responseObject=>responseObject as FetchListResponseObjectType)
              .catch(error=>{
                console.error("fetchTaskList<in Progress>", error.name, error.message);
                throw error;
              })
}

export async function createTask(props:{
  userId: UserIdType,
  projectId: ProjectIdType,
  title: string,
  description: string,
  estimatedMinute: number,
  deadlineTime: Date|null,
  dependsOn: OutcomeIdType[],
  priority: TaskPriorityType,
  recurringId: TaskRecurringIdType|null,
  style: {
    customColor: HexColorType|null,
  }
}):Promise<CreateItemResponseObjectType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`${ENDPOINT}/basic/item`);
  const option = { accessToken: apiKey };
  const responseSchema = CreateItemResponseObjectSchema;
  return await postPacket({ url, bodyData, option, responseSchema })
              .then(responseObject=>responseObject as CreateItemResponseObjectType)
              .catch(error=>{
                console.error("createTask<in Progress>", error.name, error.message);
                throw error;
              })
}