import { z } from "zod";
import { TaskIdSchema } from "../../../share/types/task";
import { TaskTimeIdSchema, TaskTimeSchema, TaskTimeWithFullSchema } from "../../../share/types/taskTime";


/////////////////////////////////////////////////////////////////////////////////////////////
//////////                           F E T C H   L I S T                           //////////
/////////////////////////////////////////////////////////////////////////////////////////////
export const FetchListRequestQuerySchema = z.object({
  taskId: TaskIdSchema.optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
})
export type FetchListRequestQueryType = z.infer<typeof FetchListRequestQuerySchema>;
export const FetchListResponseObjectSchema = z.object({
  taskTimeList: z.array(TaskTimeWithFullSchema)
}).strict();
export type FetchListResponseObjectType = z.infer<typeof FetchListResponseObjectSchema>;

/////////////////////////////////////////////////////////////////////////////////////////////
//////////                           F E T C H   I T E M                           //////////
/////////////////////////////////////////////////////////////////////////////////////////////
export const FetchItemRequestQuerySchema = z.object({ id: TaskTimeIdSchema }).strict();
export type FetchItemRequestQueryType = z.infer<typeof FetchItemRequestQuerySchema>;
export const FetchItemResponseObjectSchema = z.object({
  taskTime: TaskTimeWithFullSchema
}).strict();
export type FetchItemResponseObjectType = z.infer<typeof FetchItemResponseObjectSchema>;

/////////////////////////////////////////////////////////////////////////////////////////////
//////////                          C R E A T E   I T E M                          //////////
/////////////////////////////////////////////////////////////////////////////////////////////
export const CreateItemRequestBodySchema = z.object({
  taskId: TaskIdSchema,
  startTime: z.date(),
  endTime: z.date(),
  memo: z.string(),
})
.strict()
export type CreateItemRequestBodyType = z.infer<typeof CreateItemRequestBodySchema>;
export const CreateItemResponseObjectSchema = z.object({
  taskTime: TaskTimeSchema
}).strict();
export type CreateItemResponseObjectType = z.infer<typeof CreateItemResponseObjectSchema>;

/////////////////////////////////////////////////////////////////////////////////////////////
//////////                          U P D A T E   I T E M                          //////////
/////////////////////////////////////////////////////////////////////////////////////////////
export const UpdateItemRequestBodySchema = z.object({
  id: TaskTimeIdSchema,
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  memo: z.string().optional(),
})
export type UpdateItemRequestBodyType = z.infer<typeof UpdateItemRequestBodySchema>;
export const UpdateItemResponseObjectSchema = z.object({
  taskTime: TaskTimeSchema
}).strict();
export type UpdateItemResponseObjectType = z.infer<typeof UpdateItemResponseObjectSchema>;

/////////////////////////////////////////////////////////////////////////////////////////////
//////////                          D E L E T E   I T E M                          //////////
/////////////////////////////////////////////////////////////////////////////////////////////
export const DeleteItemRequestBodySchema = z.object({ id: TaskTimeIdSchema }).strict();
export type DeleteItemRequestBodyType = z.infer<typeof DeleteItemRequestBodySchema>;
export const DeleteItemResponseObjectSchema = z.object({
  taskTime: TaskTimeSchema
}).strict();
export type DeleteItemResponseObjectType = z.infer<typeof DeleteItemResponseObjectSchema>;