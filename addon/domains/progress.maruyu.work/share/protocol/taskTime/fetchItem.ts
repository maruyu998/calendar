import { z } from "zod";
import { CalendarIdSchema, CalendarIdType } from "@share/types/calendar";
import { TaskTimeIdSchema, TaskTimeIdType } from "../../types/taskTime";
import { HexColorSchema } from "maruyu-webcommons/commons/utils/color";
import { TaskClosingStatusSchema, TaskDeferStatusSchema, TaskIdSchema, TaskPrioritySchema, TaskRecurringIdSchema } from "../../types/task";
import { ProjectWithFullSchema } from "../../types/project";
import { OutcomeIdSchema } from "../../types/outcome";

export const RequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
  id: TaskTimeIdSchema,
})

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;


export const ResponseObjectSchema = z.object({
  taskTime: z.object({
    id: TaskTimeIdSchema,
    task: z.object({
      id: TaskIdSchema,
      title: z.string(),
      description: z.string(),
      project: ProjectWithFullSchema,
      estimatedMinute: z.number(),
      deadlineTime: z.date().nullable(),
      dependsOn: z.array(OutcomeIdSchema),
      priority: TaskPrioritySchema,
      status: z.object({
        label: z.union([TaskDeferStatusSchema, TaskClosingStatusSchema, z.null()]),
        note: z.string(),
        updatedTime: z.date(),
      }),
      recurringId: TaskRecurringIdSchema.nullable(),
      eventLog: z.array(z.object({

      })),
      style: z.object({
        customColor: HexColorSchema.nullable(),
      }),
      updatedTime: z.date(),
    }),
    startTime: z.date(),
    endTime: z.date(),
    memo: z.string(),
    updatedTime: z.date(),
  })
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
