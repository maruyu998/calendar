import { HexColorType } from "maruyu-webcommons/commons/utils/color";
import { IsoStringSchema, TimeZoneSchema, YYYYMMDDSchema } from "@ymwc/mdate";
import { z } from "zod";

export const GoogleCaleventIdSchema = z.string().brand<"GoogleCaleventId">();
export type GoogleCaleventIdType = z.infer<typeof GoogleCaleventIdSchema>;

export const GoogleCaleventColorList = [
  null, "#7986CB", "#33B679", "#8E24AA", "#E67C73",
  "#F6BF26", "#F4511E", "#039BE5", "#616161", "#3F51B5",
  "#0B8043", "#D50000"
] as (HexColorType|null)[];

export const GoogleCaleventDateSchema = z.object({
  dateTime: IsoStringSchema.nullable().optional(),
  date: YYYYMMDDSchema.nullable().optional(),
  timeZone: TimeZoneSchema.nullable().optional(),
}).refine(
  (data) => {
    // dateTime か date のどちらか一方は必須
    const hasDateTime = data.dateTime != null;
    const hasDate = data.date != null;
    return hasDateTime || hasDate;
  },
  {
    message: "Either 'dateTime' or 'date' field must be provided",
  }
).refine(
  (data) => {
    // dateTime と date の両方が設定されている場合はエラー
    const hasDateTime = data.dateTime != null;
    const hasDate = data.date != null;
    return !(hasDateTime && hasDate);
  },
  {
    message: "Cannot have both 'dateTime' and 'date' fields set simultaneously",
  }
);
export type GoogleCaleventDateType = z.infer<typeof GoogleCaleventDateSchema>;