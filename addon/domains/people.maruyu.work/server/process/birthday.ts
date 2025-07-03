import { getPacket } from "@ymwc/http";
import { Mdate, TimeZone } from "@ymwc/mdate";
import { DOMAIN } from "../../const";
import { getStoredApiKey } from "./connect";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

type TagType = {
  id: string,
  name: string,
}
const BirthAccuracies = ["exact", "maybe"] as const;
type BirthAccuracyType = typeof BirthAccuracies[number];
export type PeopleType = {
  id: string,
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
export type BirthdayType = {
  people: PeopleType,
  year: number,
  startTime: Date,
  endTime: Date,
  timeZone: TimeZone,
  createdAt: Date,
  updatedAt: Date,
}

export async function fetchBirthdayList(props:{
  userId: UserIdType,
  startTime: Date,
  endTime: Date,
  timeZone: TimeZone,
}):Promise<BirthdayType[]>{
  const { userId, ...queryData } = props;
  const { apiKey } = await getStoredApiKey({ userId });
  const url = new URL(`https://${DOMAIN}/api/externals/calendar/v1/birthday/list`);
  return await getPacket({ url, queryData, option: { accessToken: apiKey } })
              .then((data)=>{
                if (typeof data != "object") throw new Error("data is not object");
                if (!("birthdayList" in (data as object))) throw new Error("birthdayList is not found");
                const birthdayList = (data as { birthdayList: BirthdayType[] }).birthdayList;
                return birthdayList;
              }).catch(e=>{
                console.error("fetchEvent<in People Birthday>", e);
                return new Array<BirthdayType>();
              })
}
