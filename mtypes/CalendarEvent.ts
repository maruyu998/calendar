export interface CalendarEvent {
    title: string,
    start_datetime: Date,
    end_datetime: Date
}

export interface CalendarEventGroup {
    [dateString:string]: CalendarEvent[]
}