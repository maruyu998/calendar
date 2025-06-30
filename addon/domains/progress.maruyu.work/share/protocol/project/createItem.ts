import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { ProjectIdSchema, ProjectSchema } from "../../types/project";
import { OutcomeIdSchema } from "../../types/outcome";
import { HexColorSchema } from "maruyu-webcommons/commons/utils/color";
import { TaskPrioritySchema } from "../../types/task";

export const RequestBodySchema = z.object({
  calendarId: CalendarIdSchema,
  title: z.string(),
  description: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  parentProjectId: ProjectIdSchema.nullable(),
  priority: TaskPrioritySchema,
  dependsOn: z.array(OutcomeIdSchema),
  style: z.object({
    customColor: HexColorSchema.nullable(),
  })
})
export type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const ResponseObjectSchema = z.object({
  project: ProjectSchema
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;