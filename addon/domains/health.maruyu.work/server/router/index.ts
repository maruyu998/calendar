import express from "express";
import fitbitSleepLogRouter from "./fitbitSleepLog";
import settingRouter from "./setting";
import calendarRouter from "./calendar";

const router = express.Router();

router.use("/fitbitSleepLog", fitbitSleepLogRouter);
router.use("/setting", settingRouter);
router.use("/calendar", calendarRouter);

export default router;