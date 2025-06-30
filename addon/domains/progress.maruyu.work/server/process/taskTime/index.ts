import { z } from "zod";
import { getPacket, postPacket, putPacket, deletePacket } from 'maruyu-webcommons/commons/utils/fetch';
import { DOMAIN } from "../../../const";
import { TaskIdType } from '../../../share/types/task';
import { TaskTimeIdSchema, TaskTimeIdType } from "../../../share/types/taskTime";
import {
  FetchListResponseObjectSchema, FetchListResponseObjectType,
  FetchItemResponseObjectSchema, FetchItemResponseObjectType,
  CreateItemResponseObjectSchema, CreateItemResponseObjectType,
  UpdateItemResponseObjectSchema, UpdateItemResponseObjectType,
  DeleteItemResponseObjectSchema, DeleteItemResponseObjectType,
  FetchListRequestQueryType,
  FetchItemRequestQueryType,
  CreateItemRequestBodyType,
  UpdateItemRequestBodyType,
  DeleteItemRequestBodyType,
} from "./protocol";
import { getStoredApiKey } from "../connect";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

const ENDPOINT = `https://${DOMAIN}/api/v2/taskTime`;

export async function fetchTaskTimeList(props:{
  userId: UserIdType,
  startTime: Date,
  endTime: Date
}):Promise<FetchListResponseObjectType>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId: props.userId });
  const url = new URL(`${ENDPOINT}/full/list`);
  const option = { accessToken: apiKey };
  const responseSchema = FetchListResponseObjectSchema;
  return await getPacket({ url, queryData, option, responseSchema })
              .then(responseObject=>responseObject as FetchListResponseObjectType)
              .catch(error=>{
                console.error("fetchTaskTimeList<in Progress>", error.name, error.message);
                throw error;
              })
}

export async function fetchTaskTime(props:{
  userId: UserIdType,
  id: TaskTimeIdType,
}):Promise<FetchItemResponseObjectType>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId: props.userId });
  const url = new URL(`${ENDPOINT}/full/item`);
  const option = { accessToken: apiKey };
  const responseSchema = FetchItemResponseObjectSchema;
  return await getPacket({ url, queryData, option, responseSchema })
              .then(responseObject=>responseObject as FetchItemResponseObjectType)
              .catch(error=>{
                console.error("fetchTaskTime<in Progress>", error.name, error.message);
                throw error;
              })
}

export async function createTaskTime(props:{
  userId: UserIdType,
  taskId: TaskIdType,
  startTime: Date,
  endTime: Date,
  memo: string,
}):Promise<CreateItemResponseObjectType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`${ENDPOINT}/basic/item`);
  const option = { accessToken: apiKey };
  const responseSchema = CreateItemResponseObjectSchema;
  return await postPacket({ url, bodyData, option, responseSchema })
              .then(responseObject=>responseObject as CreateItemResponseObjectType)
              .catch(error=>{
                console.error("createTaskTime<in Progress>", error.name, error.message);
                throw error;
              })
}

export async function updateTaskTime(props:{
  userId: UserIdType,
  id: TaskTimeIdType,
  startTime?: Date,
  endTime?: Date,
  memo?: string,
}):Promise<UpdateItemResponseObjectType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`${ENDPOINT}/basic/item`);
  const option = { accessToken: apiKey };
  const responseSchema = UpdateItemResponseObjectSchema;
  return await putPacket({ url, bodyData, option, responseSchema })
              .then(responseObject=>responseObject as UpdateItemResponseObjectType)
              .catch(error=>{
                console.error("updateTaskTime<in Progress>", error.name, error.message);
                throw error;
              })
}

export async function deleteTaskTime(props:{
  userId: UserIdType,
  id: TaskTimeIdType
}):Promise<DeleteItemResponseObjectType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId: props.userId });
  const url = new URL(`${ENDPOINT}/basic/item`);
  const bodySchema = z.object({id: TaskTimeIdSchema});
  const option = { accessToken: apiKey };
  const responseSchema = DeleteItemResponseObjectSchema;
  return await deletePacket({ url, bodyData, bodySchema, option, responseSchema })
              .then(responseObject=>responseObject as DeleteItemResponseObjectType)
              .catch(error=>{
                console.error("deleteTaskTime<in Progress>", error.name, error.message);
                throw error;
              })
}