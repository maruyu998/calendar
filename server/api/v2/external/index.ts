import express from "express";
import googleCalendarRouter from "./calendar.google.com/index";

const router = express.Router();

router.use("/calendar.google.com", googleCalendarRouter);

export default router;