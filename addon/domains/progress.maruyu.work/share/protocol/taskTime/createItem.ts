import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { TaskTimeIdSchema } from "../../types/taskTime";
import { TaskIdSchema } from "../../types/task";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  taskId: TaskIdSchema,
  startTime: z.date(),
  endTime: z.date(),
  memo: z.string(),
}).strict();

export type RequestBodyType = z.infer<typeof RequestBodySchema>;


export const ResponseObjectSchema = z.object({
  taskTime: z.object({
    id: TaskTimeIdSchema,
    taskId: TaskIdSchema,
    startTime: z.date(),
    endTime: z.date(),
    memo: z.string(),
    updatedTime: z.date(),
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
