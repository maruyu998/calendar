import express from "express";
import fitbitSleepLogRouter from "./fitbitSleepLog";
import settingRouter from "./setting";

const router = express.Router();

router.use("/fitbitSleepLog", fitbitSleepLogRouter);
router.use("/setting", settingRouter);

export default router;