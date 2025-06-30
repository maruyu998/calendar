export {}
// import express from "express";
// import ical from "ical-generator";
// import { CaleventModel } from "@server/mongoose/CaleventModel";

// const BasicInfo = { userId: 'idwlthtstf', password: 'aaaaaaaaaaaaa' }

// const router = express.Router();

// function basicAuth(request:express.Request, response:express.Response, next:express.NextFunction){
//   const b64auth = (request.headers.authorization || '').split(' ')[1] || '';
//   const [userId, password] = Buffer.from(b64auth, 'base64').toString().split(':');
//   if(userId && password && userId === BasicInfo.userId && password === BasicInfo.password){
//     response.locals.userInfo as UserInfoType = { userId };
//     return next();
//   }
//   response.set('WWW-Authenticate', 'Basic realm="401"');
//   response.status(401).send('Authentication required.');
// }

// router.propfind("/calendars/:calendarId", [
//   basicAuth
// ], async function(request:express.Request, response:express.Response){
//   const { userId } = response.locals.userInfo as UserInfoType;
//   const { calendarId } = request.params;
//   if (!calendarId) {
//     response.status(400).send({ error: "calendarId is required" });
//     return;
//   }
//   // CaleventModel.find({
//   //   calendarId,

//   // })
// })

// router.report("/", [

// ], async function(request:express.Request, response:express.Response){

// })

// router.get("/events/:eventId", [

// ], async function(request:express.Request, response:express.Response){

// })

// router.put("/events/:eventId", [

// ], async function(request:express.Request, response:express.Response){

// })

// router.delete("/events/:eventId", [

// ], async function(request:express.Request, response:express.Response){

// })

// export default router;