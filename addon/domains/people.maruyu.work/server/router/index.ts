import express from "express";
import activityRouter from "./activity";
import settingRouter from "./setting";
import calendarRouter from "./calendar";

const router = express.Router();

router.use("/activity", activityRouter);
router.use("/setting", settingRouter);
router.use("/calendar", calendarRouter);

export default router;