import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CalendarMongoType, CalendarPermissions, CalendarSources, CalendarStyleDisplays } from 'mtypes/v2/Calendar';

export const CalendarModel = mongoose.model<CalendarMongoType>('calendar',
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
        enum: CalendarSources,
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
        enum: CalendarPermissions,
        required: true
      }],
      style: {
        display: {
          type: String,
          enum: CalendarStyleDisplays,
          required: true
        }
      },
      data: {
        type: mongoose.Schema.Types.Mixed,
        required: false
      }
    }, {
      timestamps: true
    })
    schema.index({ userId:1, calendarSource: 1, uniqueKeyInSource: 1 }, {unique: true})
    return schema
  })()
);