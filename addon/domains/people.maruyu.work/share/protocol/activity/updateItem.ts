import { z } from "zod";
import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { ActivityIdSchema, ActivityIdType } from "../../types/activity";
import { PeopleIdSchema, PeopleIdType, PeopleSchema } from "../../types/people";


export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  id: ActivityIdSchema,
  peopleIdList: z.array(PeopleIdSchema).optional(),
  title: z.string().optional(),
  memo: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
})

export type RequestBodyType = z.infer<typeof RequestBodySchema>;



// // // // // // // // // // // // // // // // // // // // // // // // //
export const ResponseObjectSchema = z.object({
  activity: z.object({
    id: ActivityIdSchema,
    title: z.string().optional(),
    peopleList: z.array(PeopleSchema),
    startTime: z.date(),
    endTime: z.date(),
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
