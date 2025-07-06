import express from "express";
import settingRouter from "./setting";
import calendarRouter from "./calendar";

const router = express.Router();

router.use("/setting", settingRouter);
router.use("/calendar", calendarRouter);

export default router;