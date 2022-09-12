import { Router } from "express";
import messageController from "../controller/message.controller.js";
import checkToken from "../middleware/checkToken.js";

const router = Router();

router.get("/messages", checkToken, messageController.GET);

export default router;
