import express from "express";
import apiauthRouter from "./apiauth";

const router = express.Router();

router.use("/apiauth", apiauthRouter);

export default router;