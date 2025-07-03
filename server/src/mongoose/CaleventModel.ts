import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { CaleventIdType, CaleventPermissionList, CaleventSchema, CaleventStyleDisplayList, CaleventPermissionType, CaleventType } from "@share/types/calevent";
import { CalendarIdType, CalendarSourceType } from "@share/types/calendar";
import { InternalServerError } from "@ymwc/errors";
import { Mdate } from "@ymwc/mdate";
import { UserIdType } from "maruyu-webcommons/commons/types/user";

type CaleventMongoType = {
  _id: mongoose.Schema.Types.ObjectId,
  userId: UserIdType,
  id: CaleventIdType,
  calendarId: CalendarIdType,
  calendarSource: CalendarSourceType,
  title: string,
  description: string,
  startTime: Date,
  endTime: Date,
  permissions: CaleventPermissionType[],
  style: {
    isAllDay: boolean,
    mainColor?: string,
  },
  createdAt: Date|null,
  updatedAt: Date,
  isDeleted: boolean,
  data: Record<string, any>,
}

const CaleventModel = mongoose.model<CaleventMongoType>("calevent",
  (()=>{
    const schema = new mongoose.Schema<CaleventMongoType>({
      id: {
        type: String,
        unique: true,
        default: ()=>uuidv4()
      },
      userId: {
        type: String,
        required: true
      },
      calendarId:{
        type: String,
        required: true
      },
      calendarSource: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: false
      },
      description: {
        type: String,
        required: true
      },
      startTime: {
        type: Date,
        required: true
      },
      endTime: {
        type: Date,
        required: true
      },
      permissions: [{
        type: String,
        enum: CaleventPermissionList,
        required: true
      }],
      style: {
        isAllDay: {
          type: Boolean,
          required: true,
        },
        display: {
          type: String,
          enum: CaleventStyleDisplayList,
          required: true
        },
        mainColor: {
          type: String,
          required: true
        }
      },
      isDeleted: {
        type: Boolean,
        required: true,
        default: false
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
    });
    return schema;
  })()
);

export async function fetchItem({
  userId,
  caleventId,
}:{
  userId: UserIdType,
  caleventId: CaleventIdType,
}):Promise<CaleventType|null>{
  const rawCalevent = await CaleventModel.findOne(
    { userId, id: caleventId },
    {
      _id:0, id:1, calendarId:1,
      // calendarSource:1,
      title:1, startTime:1, endTime:1, permissions:1, style:1, data:1, updatedAt:1,
      // description:1,
      isDeleted:1
    },
    { }
  ).lean();
  if(rawCalevent == null) return null;
  const convertedCalevent = {
    id: rawCalevent.id,
    calendarId: rawCalevent.calendarId,
    // calendarSource: rawCalevent.calendarSource,
    title: rawCalevent.title,
    // description: rawCalevent.description,
    startMdate: new Mdate(rawCalevent.startTime.getTime()),
    endMdate: new Mdate(rawCalevent.endTime.getTime()),
    permissions: rawCalevent.permissions,
    updatedAt: rawCalevent.updatedAt,
    style: rawCalevent.style,
    data: rawCalevent.data,
  }
  const { success, error, data: calevent } = CaleventSchema.safeParse(convertedCalevent)
  if(!success){
    console.log(error);
    throw new InternalServerError("fetched calevent does not match the schema");
  }
  return calevent;
}