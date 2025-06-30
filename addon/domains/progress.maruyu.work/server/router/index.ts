import express from "express";
import settingRouter from "./setting";
import taskTimeRouter from "./taskTime";
import taskRouter from "./task";
import projectRouter from "./project";

const router = express.Router();

router.use("/setting", settingRouter);
router.use("/taskTime", taskTimeRouter);
router.use("/task", taskRouter);
router.use("/project", projectRouter);

export default router;