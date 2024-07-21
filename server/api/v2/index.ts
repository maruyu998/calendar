import express from 'express';
import externalRouter from './external/index';
import sessionRouter from "../session";
import calendarRouter from "./calendar";
import caleventRouter from "./calevent";

const router = express.Router();

router.use('/external', externalRouter);
router.use('/session', sessionRouter);
router.use('/calendar', calendarRouter);
router.use('/calevent', caleventRouter);

// https://qiita.com/chenglin/items/b4bd94507e384962c609
// CalDAVC を使った方が良い
// router.get("/ical", [
//   requireQueryParams("key")
// ], async function(request, response){
//   const { key } = response.locals.queries;
  
// })

export default router;