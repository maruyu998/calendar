import { deletePacket, getPacket, postPacket, patchPacket } from "@ymwc/http";
import { DOMAIN_ENDPOINT } from "../../const";
import { 
  ResponseObjectSchema as FetchListResponseObjectSchema,
  ResponseObjectType as FetchListResponseObjectType,
  RequestQuerySchema as FetchListRequestQuerySchema,
  RequestQueryType as FetchListRequestQueryType,
} from "../../share/protocol/task/fetchList";
import { 
  ResponseObjectSchema as CreateItemResponseObjectSchema,
  ResponseObjectType as CreateItemResponseObjectType,
  RequestBodySchema as CreateItemRequestBodySchema,
  RequestBodyType as CreateItemRequestBodyType,
} from "../../share/protocol/task/createItem";

export async function fetchTaskList(queryData: FetchListRequestQueryType):Promise<FetchListResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/task/list`, window.location.href);
  const querySchema = FetchListRequestQuerySchema;
  const responseSchema = FetchListResponseObjectSchema;
  return await getPacket({ url, queryData, querySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

// export async function fetchTask(props:{
//   calendarId: CalendarIdType,
//   id: TaskIdType,
// }):Promise<FetchItemResponseObjectType>{
//   const url = new URL(`${DOMAIN_ENDPOINT}/task/item`, window.location.href);
//   url.search = "?" + createFetchItemRequestQuery(props)
//   return await getPacket(url.toString(), {}, FetchItemResponseObjectSchema, window)
//               .then(({title, message, data})=>(data as FetchItemResponseObjectType))
//               .catch(error => {
//                 console.error(error);
//                 throw error;
//               });
// }

export async function createTask(bodyData: CreateItemRequestBodyType):Promise<CreateItemResponseObjectType>{
  const url = new URL(`${DOMAIN_ENDPOINT}/task/item`, window.location.href);
  const bodySchema = CreateItemRequestBodySchema;
  const responseSchema = CreateItemResponseObjectSchema;
  return await postPacket({ url, bodyData, bodySchema, responseSchema })
              .catch(error => {
                console.error(error);
                throw error;
              });
}

// export async function updateTask(props:{
//   calendarId: CalendarIdType,
//   id: TaskIdType,
//   title?: string,
//   description?: string,
//   startMdate: Mdate,
//   endMdate: Mdate,
//   estimatedMinute: number,
//   deadlineMdate?: Mdate,
//   priority: number,
// }):Promise<UpdateItemResponseObjectType>{
//   console.assert(props.startMdate.unix < props.endMdate.unix)
//   const body = createUpdateItemRequestBody(props);
//   return await putPacket(`${DOMAIN_ENDPOINT}/task/item`, body, {}, UpdateItemResponseObjectSchema, window)
//               .then(({title, message, data})=>(data as UpdateItemResponseObjectType))
//               .catch(error => {
//                 console.error(error);
//                 throw error;
//               });
// }

// export async function deleteTask(props:{
//   calendarId: CalendarIdType,
//   id: TaskIdType
// }):Promise<DeleteItemResponseObjectType>{
//   const body = deleteUpdateItemRequestBody(props);
//   return await deletePacket(`${DOMAIN_ENDPOINT}/task/item`, body, {}, DeleteItemResponseObjectSchema, window)
//               .then(({title, message, data})=>(data as DeleteItemResponseObjectType))
//               .catch(error => {
//                 console.error(error);
//                 throw error;
//               });
// }