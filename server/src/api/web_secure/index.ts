import express from "express";

import sessionRouter from "./session";
import apshRouter from "./apsh";
import addonRouter from "@addon/server/router";
import settingsRouter from "./settings";
import testingRouter from "./testing";

const router = express.Router();

router.use('/session', sessionRouter);
router.use("/apsh", apshRouter);
router.use("/addon", addonRouter);
router.use("/settings", settingsRouter);
router.use("/testing", testingRouter);

export default router;