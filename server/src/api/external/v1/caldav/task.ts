import express from "express";
// import { Mdate } from "maruyu-webcommons/commons/utils/mdate";
// import { InvalidParamError } from "maruyu-webcommons/node/errors";
// import { sendData, sendError } from "maruyu-webcommons/node/express";

// const router = express.Router();

// router.get('/list', [
//   requireSignin,
//   requireQueryParams("startUnix", "endUnix")
// ], async function(request:express.Request, response:express.Response){
//   const { userId } = response.locals.userInfo as UserInfoType;
//   const { startUnix, endUnix } = response.locals.queries;
//   if(Number.isNaN(Number(startUnix))){
//     return sendError(response, new InvalidParamError("startUnix is invalid"));
//   }
//   if(Number.isNaN(Number(endUnix))){
//     return sendError(response, new InvalidParamError("endUnix is invalid"));
//   }
//   const startMdate = startUnix ? new Mdate(Number(startUnix)) : undefined;
//   const endMdate = endUnix ? new Mdate(Number(endUnix)) : undefined;
//   getTaskList({ userId, startMdate, endMdate })
//     .then(taskList => {
//       sendData(response, "GetTaskList", "", { taskList }, false);
//     })
//     .catch(error => {
//       sendError(response, error);
//     });
// });


// router.post("/item", [
//   requireSignin,
//   requireBodyParams("taskId","startUnix","endUnix")
// ], async function(request:express.Request, response:express.Response){
//   const { userId } = response.locals.userInfo as UserInfoType;
//   const { taskId, startUnix, endUnix } = response.locals.bodies;
//   const startTime = startUnix && new Date(startUnix);
//   if(startTime !== undefined && Number.isNaN(startTime.getTime())) {
//     return sendError(response, new InvalidParamError("startUnix is invalid"));
//   }
//   const endTime = endUnix && new Date(endUnix);
//   if(endTime !== undefined && Number.isNaN(endTime.getTime())) {
//     return sendError(response, new InvalidParamError("endUnix is invalid"));
//   }
//   const now = Date.now();
//   const status:TaskStatusType = (()=>{
//     if(now < startTime.getTime()) return "planned";
//     if(now <= endTime.getTime()) return "going";
//     return "completed";
//   })();
//   updateTask({ userId, taskId, startTime, endTime, status })
//     .then(task => {
//       sendData(response, "AddTaskItem", "", { task }, false);
//     })
//     .catch(error => {
//       sendError(response, error);
//     });
// });

// router.put("/item", [
//   requireSignin,
//   requireBodyParams("taskId")
// ], async function(request:express.Request, response:express.Response){
//   const { userId } = response.locals.userInfo as UserInfoType;
//   const { taskId } = response.locals.bodies;
//   // const { title, description, startUnix, endUnix } = request.body;
//   const { title, startUnix, endUnix } = request.body;
//   const startTime = startUnix && new Date(startUnix);
//   if(startTime !== undefined && Number.isNaN(startTime.getTime())) {
//     return sendError(response, new InvalidParamError("startUnix is invalid"));
//   }
//   const endTime = endUnix && new Date(endUnix);
//   if(endTime !== undefined && Number.isNaN(endTime.getTime())) {
//     return sendError(response, new InvalidParamError("endUnix is invalid"));
//   }
//   const now = Date.now();
//   const status:TaskStatusType = (()=>{
//     if(now < startTime.getTime()) return "planned";
//     if(now <= endTime.getTime()) return "going";
//     return "completed";
//   })();
//   updateTask({ userId, taskId, title, startTime, endTime, status })
//     .then(task => {
//       sendData(response, "UpdateTaskItem", "", { task }, false);
//     })
//     .catch(error => {
//       sendError(response, error);
//     });
// });

// router.delete("/item", [
//   requireSignin,
//   requireBodyParams("taskId")
// ], async function(request:express.Request, response:express.Response){
//   const { userId } = response.locals.userInfo as UserInfoType;
//   const { taskId } = response.locals.bodies;
//   const status:TaskStatusType = "listed";
//   updateTask({
//     userId, taskId, status,
//     startTime: null,
//     endTime: null,
//   })
//     .then(task => {
//       sendData(response, "deleteTaskItem", "delete task start/end time", { task }, false);
//     })
//     .catch(error => {
//       sendError(response, error);
//     });
// });

// export default router;