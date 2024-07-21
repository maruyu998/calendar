import { CalendarIdType, CalendarSourceType, CalendarType } from "mtypes/v2/Calendar";
import { CalendarModel } from "../mongoose/CalendarModel";

export async function getList({
  userId
}:{
  userId: string
}):Promise<CalendarType[]>{
  const calendarList = await CalendarModel.find(
    { userId },
    { 
      _id:0, id:1, calendarSource:1, uniqueKeyInSource:1, 
      name:1, description:1, permissions:1, style:1, data:1, 
    }, 
    { }
  ).lean();
  return calendarList;
}

export async function addItem({
  userId,
  calendarNewData
}:{
  userId: string,
  calendarNewData: Omit<CalendarType,"id">
}){
  const calendar = await CalendarModel.create({ userId, ...calendarNewData });
  if(calendar == null) throw new Error("creating new calendar was failed.");
  return calendar.toJSON();
}

export async function editItem({
  userId,
  calendarId,
  calendarUpdateData
}:{
  userId: string,
  calendarId: CalendarIdType,
  calendarUpdateData: Partial<Pick<CalendarType, "name"|"description"|"permissions"|"style"|"data">>
}){
  const calendar = await CalendarModel.findOneAndUpdate(
    { userId, id:calendarId },
    { $set: { ...calendarUpdateData } }, 
    { upsert: false, new: true }
  );
  if(calendar == null) throw new Error("updating calendar was failed. (not found)");
  return calendar.toJSON();
}