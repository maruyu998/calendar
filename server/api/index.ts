import express from "express";
import sessionRouter from "./session";
// import v1ApiRouter from "./v1/index";
import v2ApiRouter from "./v2/index";

const router = express.Router();

router.use("/session", sessionRouter);
// router.use("/v1", v1ApiRouter);
router.use("/v2", v2ApiRouter);

export default router;