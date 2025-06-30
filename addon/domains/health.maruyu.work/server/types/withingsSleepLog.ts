

export type RawWithingsNightEventType = {
  id: string,
  title: string,
  description: string,
  startTime: Date,
  endTime: Date,
  createdAt: Date,
  updatedAt: Date,
  external: {
    withings: {
      sleepId: string,
      dayIndex: number,
      url: string
    }
  }
}