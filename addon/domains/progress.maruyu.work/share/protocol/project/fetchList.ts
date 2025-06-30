import { z } from "zod";
import { CalendarIdSchema } from "@share/types/calendar";
import { ProjectIdSchema, ProjectWithFullSchema } from "../../types/project";

export const RequestQuerySchema = z.object({
  calendarId: CalendarIdSchema,
  parentProjectId: ProjectIdSchema.optional(),
})

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;


export const ResponseObjectSchema = z.object({
  projectList: z.array(ProjectWithFullSchema)
});

export type ResponseObjectType = z.infer<typeof ResponseObjectSchema>;
