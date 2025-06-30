import express from "express";
import androidAppUsageRouter from "./androidAppUsage";
import settingRouter from "./setting";

const router = express.Router();

router.use("/androidAppUsage", androidAppUsageRouter);
router.use("/setting", settingRouter);

export default router;