import {
  ResponseObjectType as FetchItemResponseObjectType,
} from "../../share/protocol/fitbitSleepLog/fetchItem";
import { FitbitIdType, FitbitSleepLogIdType } from "../../share/types/fitbitSleepLog";

export type RawFitbitNightEventType = {
  id: FitbitSleepLogIdType,
  title: string,
  description: string,
  startTime: Date,
  endTime: Date,
  createdAt: Date,
  updatedAt: Date,
  external: {
    fitbit: {
      logId: FitbitIdType,
      innerIndex: number
    }
  }
}

export function convertRawToFetchItemResponseObject(
  raw: RawFitbitNightEventType,
):FetchItemResponseObjectType{
  const { id, title, description, startTime, endTime, updatedAt, external } = raw;
  return {
    fitbitSleepLog: {
      id,
      title, 
      description,
      startTime,
      endTime,
      updatedAt,
      fitbitId: external.fitbit.logId,
      fitbitInnerIndex: external.fitbit.innerIndex,
    }
  }
}