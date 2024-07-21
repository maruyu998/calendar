import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CaleventMongoType, CaleventPermissions, CaleventStyleDisplays } from 'mtypes/v2/Calevent';
import { CalendarSources } from 'mtypes/v2/Calendar';

export const CaleventModel = mongoose.model<CaleventMongoType>('caleveent',
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
        enum: CalendarSources,
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
        enum: CaleventPermissions,
        required: true
      }],
      style: {
        isAllDay: {
          type: Boolean,
          required: true,
        },
        display: {
          type: String,
          enum: CaleventStyleDisplays,
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
        type: mongoose.Schema.Types.Mixed,
        required: false
      }
    }, {
      timestamps: true
    })
    // schema.index({ userId:1, calendarSource: 1, uniqueKeyInSource: 1 }, {unique: true})
    return schema
  })()
);