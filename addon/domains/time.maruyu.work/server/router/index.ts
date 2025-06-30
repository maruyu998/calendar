import express from "express";
import logRouter from "./log";
import quotaRouter from "./quota";
import settingRouter from "./setting";

const router = express.Router();

router.use("/log", logRouter);
router.use("/quota", quotaRouter);
router.use("/setting", settingRouter);

export default router;