import express from "express";
import androidAppUsageRouter from "./androidAppUsage";
import settingRouter from "./setting";
import calendarRouter from "./calendar";

const router = express.Router();

router.use("/androidAppUsage", androidAppUsageRouter);
router.use("/setting", settingRouter);
router.use("/calendar", calendarRouter);

export default router;