import { z } from "zod";
import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { TaskPrioritySchema, TaskPriorityType, TaskRecurringIdSchema, TaskRecurringIdType, TaskSchema, TaskWithFullSchema } from "../../types/task";
import { ProjectIdSchema, ProjectIdType } from "../../types/project";
import { OutcomeIdSchema, OutcomeIdType } from "../../types/outcome";
import { HexColorSchema, HexColorType } from "maruyu-webcommons/commons/utils/color";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  projectId: ProjectIdSchema,
  title: z.string(),
  description: z.string(),
  estimatedMinute: z.number().int().positive(),
  deadlineTime: z.date().nullable(),
  dependsOn: z.array(OutcomeIdSchema),
  priority: TaskPrioritySchema,
  recurringId: TaskRecurringIdSchema.nullable(),
  style: z.object({
    customColor: HexColorSchema.nullable(),
  })
})
export type RequestBodyType = z.infer<typeof RequestBodySchema>;


export const ResponseObjectSchema = z.object({
  task: TaskSchema
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;