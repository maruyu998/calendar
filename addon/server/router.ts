import express from "express";
import calendarGoogleCom from "../domains/calendar.google.com/server/router";
import calendarMaruyuWork from "../domains/calendar.maruyu.work/server/router";
import datafootMaruyuWork from "../domains/datafoot.maruyu.work/server/router";
import healthMaruyuWork from "../domains/health.maruyu.work/server/router";
import peopleMaruyuWork from "../domains/people.maruyu.work/server/router";
import progressMaruyuWork from "../domains/progress.maruyu.work/server/router";
import timeMaruyuWork from "../domains/time.maruyu.work/server/router";

const router = express.Router();

router.use("/calendar.google.com", calendarGoogleCom);
router.use("/calendar.maruyu.work", calendarMaruyuWork);
router.use("/datafoot.maruyu.work", datafootMaruyuWork);
router.use("/health.maruyu.work", healthMaruyuWork);
router.use("/people.maruyu.work", peopleMaruyuWork);
router.use("/progress.maruyu.work", progressMaruyuWork);
router.use("/time.maruyu.work", timeMaruyuWork);

export default router;