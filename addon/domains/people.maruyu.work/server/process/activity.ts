import { getPacket, postPacket, putPacket, deletePacket } from "@ymwc/http";
import { Mdate } from "@ymwc/mdate";
import { DOMAIN } from "../../const";
import { ActivityIdType } from "../../share/types/activity";
import { PeopleIdType } from "../../share/types/people";
import { getStoredApiKey } from "./connect";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

type TagType = {
  id: string,
  name: string,
}
const BirthAccuracies = ["exact", "maybe"] as const;
type BirthAccuracyType = typeof BirthAccuracies[number];
export type RawPeopleType = {
  id: PeopleIdType,
  name: {
    nick?: string,
    family?: {
      original?: string,
      alphabet: string,
    },
    middle?: {
      original?: string,
      alphabet: string,
    },
    given?: {
      original?: string,
      alphabet: string
    }
  },
  birth: {
    year?: {
      num: number,
      accuracy: BirthAccuracyType
    },
    month?: {
      num: number,
      accuracy: BirthAccuracyType
    },
    date?: {
      num: number,
      accuracy: BirthAccuracyType
    }
  },
  tags: TagType[],
  memo: string,
}
export type RawActivityType = {
  id: ActivityIdType,
  title?: string,
  startTime: Date,
  endTime: Date,
  peopleList: RawPeopleType[],
  memo?: string,
  createdAt: Date,
  updatedAt: Date,
}

export async function fetchActivityList(props:{
  userId: UserIdType,
  startTime: Date,
  endTime: Date,
}):Promise<RawActivityType[]>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/v1/activity/list`);
  return await getPacket({ url, queryData, option: { accessToken: apiKey } })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("activityList" in (data as object))) throw new Error("activityList is not found");
                const activityList = (data as { activityList: RawActivityType[] }).activityList;
                return activityList;
              }).catch(e=>{
                console.error("fetchEvent<in People>", e);
                return new Array<RawActivityType>();
              })
}

export async function fetchActivity(props:{
  userId: UserIdType,
  id: ActivityIdType,
}):Promise<RawActivityType>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/v1/activity/item`);
  return await getPacket({ url, queryData, option: { accessToken: apiKey } })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("activity" in (data as object))) throw new Error("activity is not found");
                const activity = (data as { activity: RawActivityType }).activity;
                return activity;
              })
}

export async function createActivity(props:{
  userId: UserIdType,
  title?: string,
  memo?: string,
  peopleIdList: PeopleIdType[],
  startTime: Date,
  endTime: Date
}):Promise<RawActivityType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/v1/activity/item`);
  return await postPacket({ url, bodyData, option: { accessToken: apiKey } })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("activity" in (data as object))) throw new Error("activity is not found");
                const activity = (data as { activity: RawActivityType }).activity;
                return activity;
              })
}

export async function updateActivity(props:{
  userId: UserIdType,
  id: ActivityIdType,
  peopleIdList?: PeopleIdType[]
  title?: string,
  memo?: string,
  startTime?: Date,
  endTime?: Date
}):Promise<RawActivityType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/v1/activity/item`);
  return await putPacket({ url, bodyData, option: { accessToken: apiKey } })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("activity" in (data as object))) throw new Error("activity is not found");
                const activity = (data as { activity: RawActivityType }).activity;
                return activity;
              })
}

export async function deleteActivity(props:{
  userId: UserIdType,
  id: ActivityIdType,
}):Promise<RawActivityType>{
  const { userId, ...bodyData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/v1/activity/item`);
  return await deletePacket({ url, bodyData, option: { accessToken: apiKey } })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("activity" in (data as object))) throw new Error("activity is not found");
                const activity = (data as { activity: RawActivityType }).activity;
                return activity;
              })
}