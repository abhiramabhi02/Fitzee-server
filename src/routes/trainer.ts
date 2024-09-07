import { Router } from "express";
import TrainerController from "../controllers/trainerController";
import { verifyJwt } from "../services/jwt";
import AdminController from "../controllers/adminController";

const router = Router();

//post request for the registration of trainer contanins [registration data] in body
router.post("/registration", TrainerController.Registration);

//post request for the login of the trainer contains [email, password] in body
router.post("/login", TrainerController.login);

//get request for fetching user for the trainer contains [item] in query
router.get("/getitems", verifyJwt, AdminController.getItems);

export default router;
