import express from "express";
import activityRouter from "./activity";
import settingRouter from "./setting";

const router = express.Router();

router.use("/activity", activityRouter);
router.use("/setting", settingRouter);

export default router;