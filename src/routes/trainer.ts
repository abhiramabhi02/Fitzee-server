import { Router } from "express";
import TrainerController from "../controllers/trainerController";
import { verifyJwt } from "../services/jwt";


const router = Router()

router.post('/registration', TrainerController.Registration)

router.post('/login', TrainerController.login)




export default router