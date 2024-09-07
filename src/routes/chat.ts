import { Router } from "express";
import ChatController from "../controllers/chatController";
import { verifyJwt } from "../services/jwt";


const router = Router()

//fetching rooms from database by userid
router.get('/getrooms/:id/:role', ChatController.getRoomsById)

export default router    