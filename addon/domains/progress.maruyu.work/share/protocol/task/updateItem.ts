import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { TaskIdSchema, TaskPrioritySchema, TaskWithFullSchema } from "../../types/task";


export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  id: TaskIdSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  deadlineTime: z.date().nullable(),
  estimatedMinute: z.number().int().optional(),
  priority: TaskPrioritySchema.optional(),
}).strict();

export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  task: TaskWithFullSchema
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
