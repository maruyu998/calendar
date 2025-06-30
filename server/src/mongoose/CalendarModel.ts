import mongoose from 'mongoose';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  CalendarIdType, CalendarPermissionList,
  CalendarSchema, CalendarStyleDisplayList, CalendarType,
  CalendarPermissionType, CalendarSourceType, CalendarStyleDisplayType,
  CalendarUniqueKeyInSourceType,
} from '@share/types/calendar';
import { InternalServerError } from 'maruyu-webcommons/node/errors';
import { HexColorType } from 'maruyu-webcommons/commons/utils/color';
import { UserIdType } from 'maruyu-webcommons/commons/types/user';

type CalendarMongoType = {
  _id: mongoose.Types.ObjectId,
  userId: UserIdType,
  uniqueKeyInSource: CalendarUniqueKeyInSourceType,
  id: CalendarIdType,
  calendarSource: CalendarSourceType,
  name: string,
  description: string,
  permissions: CalendarPermissionType[],
  style: {
    display: CalendarStyleDisplayType,
    color: HexColorType,
  },
  data: Record<string, any>,
}

const CalendarModel = mongoose.model<CalendarMongoType>('calendar',
  (()=>{
    const schema = new mongoose.Schema<CalendarMongoType>({
      id: {
        type: String,
        unique: true,
        default: ()=>uuidv4()
      },
      userId: {
        type: String,
        required: true
      },
      calendarSource: {
        type: String,
        // enum: CalendarSources,
        required: true
      },
      uniqueKeyInSource: {
        type: String,
        required: false
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: false
      },
      permissions: [{
        type: String,
        enum: CalendarPermissionList,
        required: true
      }],
      style: {
        display: {
          type: String,
          enum: CalendarStyleDisplayList,
          required: true
        },
        color: {
          type: String,
          required: true,
        }
      },
      data: {
        type: Object,
        required: true,
        validate: {
          validator: function(v: any) {
            return v && typeof v === 'object' && !Array.isArray(v);
          },
          message: 'data must be a non-null object.'
        },
        default: {}
      }
    }, {
      timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
      }
    })
    schema.index({ userId:1, calendarSource: 1, uniqueKeyInSource: 1 }, {unique: true})
    return schema
  })()
);

export async function fetchList({
  userId,
}:{
  userId: UserIdType,
}):Promise<CalendarType[]>{
  const rawCalendarList = await CalendarModel.find(
    { userId },
    {
      _id:0, id:1, calendarSource:1, uniqueKeyInSource:1,
      name:1, description:1, permissions:1, style:1, data:1,
    },
    { }
  ).lean();
  const convertedCalendarList = rawCalendarList.map(rawCalendar=>({
    id: rawCalendar.id,
    calendarSource: rawCalendar.calendarSource,
    uniqueKeyInSource: rawCalendar.uniqueKeyInSource,
    name: rawCalendar.name,
    description: rawCalendar.description,
    permissions: rawCalendar.permissions,
    style: rawCalendar.style,
    data: rawCalendar.data,
  }));
  const { success, error, data: calendarList } = z.array(CalendarSchema).safeParse(convertedCalendarList);
  if(!success){
    console.log(error);
    throw new InternalServerError("fetched calendar does not match the schema");
  }
  return calendarList;
}

export async function fetchItem({
  userId,
  calendarId,
}:{
  userId: UserIdType,
  calendarId: CalendarIdType,
}):Promise<CalendarType|null>{
  const rawCalendar = await CalendarModel.findOne(
    { userId, id: calendarId },
    {
      _id:0, id:1, calendarSource:1, uniqueKeyInSource:1,
      name:1, description:1, permissions:1, style:1, data:1,
    },
    { }
  ).lean();
  if(rawCalendar == null) return null;
  const convertedCalendar = {
    id: rawCalendar.id,
    calendarSource: rawCalendar.calendarSource,
    uniqueKeyInSource: rawCalendar.uniqueKeyInSource,
    name: rawCalendar.name,
    description: rawCalendar.description,
    permissions: rawCalendar.permissions,
    style: rawCalendar.style,
    data: rawCalendar.data,
  }
  const { success, error, data: calendar } = CalendarSchema.safeParse(convertedCalendar)
  if(!success){
    console.log(error);
    throw new InternalServerError("fetched calendar does not match the schema");
  }
  return calendar;
}

export async function updateItem({
  userId,
  calendarSource,
  uniqueKeyInSource,
  name,
  description,
  permissions,
  style,
  data,
}:{
  userId: UserIdType,
  calendarSource: CalendarSourceType,
  uniqueKeyInSource: CalendarUniqueKeyInSourceType,
  name: string,
  description: string,
  permissions: CalendarPermissionType[],
  style: {
    display: CalendarStyleDisplayType,
    color: HexColorType,
  },
  data?: Record<string, any>
}){
  const query = { userId, calendarSource, uniqueKeyInSource };
  return await CalendarModel.findOneAndUpdate(query, {
      $set: {
        name, description, permissions, style, data,
      }
    }, { upsert: true, new: true });
}