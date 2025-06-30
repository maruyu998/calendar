import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { TaskWithFullSchema } from "../../types/task";
import { ProjectIdSchema } from "../../types/project";

export const RequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
  projectId: ProjectIdSchema.optional(),
})

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;


export const ResponseObjectSchema = z.object({
  taskList: z.array(TaskWithFullSchema)
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
