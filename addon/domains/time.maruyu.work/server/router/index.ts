import express from "express";
import logRouter from "./log";
import quotaRouter from "./quota";
import settingRouter from "./setting";
import calendarRouter from "./calendar";

const router = express.Router();

router.use("/log", logRouter);
router.use("/quota", quotaRouter);
router.use("/setting", settingRouter);
router.use("/calendar", calendarRouter);

export default router;