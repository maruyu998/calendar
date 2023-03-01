import { timezone } from './date';
import MDate from '../mutils/mdate';

export interface CalendarEvent {
    title: string,
    start_datetime: MDate,
    end_datetime: MDate,
    calendar_id: string,
    display_styles: {
        background_color: string
    },
}

export interface CalendarEventGroup {
    [dateString:string]: CalendarEvent[]
}

export interface Calendar {
    user: string,
    calendar_type: string,
    unique_key: string,
    data: any
}

export type GCalAccesRole = 'owner'|"reader"|'writer'|'freeBusyReader'

export interface GCalCalendar {
    kind: string,
    etag: string,
    id: string,
    summary: string,
    description: string,
    timeZone: timezone,
    summaryOverride: string,
    colorId: string,
    backgroundColor: string,
    foregroundColor: string,
    hidden: boolean,
    selected: boolean,
    location: string,
    accessRole: GCalAccesRole,
    defaultReminders: {
        method: string,
        minutes: Number
    }[],
    notificationSettings: {
        notifications: {
            type: string,
            method: string
        }[]
    },
    primary: boolean,
    deleted: boolean,
    conferenceProperties: {
        allowedConferenceSolutionTypes: string[]
    }
}

export interface GCalEvent {
    kind: string,
    etag: string,
    id: string,
    status: string,
    htmlLink: string,
    created: Date,
    updated: Date,
    summary: string,
    colorId: string,
    creator: { email: string },
    organizer: {
      email: string,
      displayName: string,
      self: boolean
    },
    start: { dateTime: Date, timeZone: timezone },
    end: { dateTime: Date, timeZone: timezone },
    recurringEventId: string,
    originalStartTime: { dateTime: string, timeZone: string },
    iCalUID: string,
    sequence: number,
    reminders: { useDefault: boolean },
    eventType: string
}