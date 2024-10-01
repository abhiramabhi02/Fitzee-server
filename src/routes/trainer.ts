import { Router } from "express";
import TrainerController from "../controllers/trainerController";
import { verifyJwt } from "../services/jwt";
import AdminController from "../controllers/adminController";
import UserController from "../controllers/userController";

const router = Router();

//post request for the registration of trainer contanins [registration data] in body
router.post("/registration", TrainerController.Registration);

//post request for the login of the trainer contains [email, password] in body
router.post("/login", TrainerController.login);

//get request for fetching user for the trainer contains [item] in query
router.get("/getitems", verifyJwt, AdminController.getItems);

router.get('/gettrainer', verifyJwt, UserController.getUserbyId)

router.put('/updatetrainer', verifyJwt, AdminController.updateItems)

router.post("/setdiet", verifyJwt, TrainerController.setUserDiet)

router.put("/updatediet", verifyJwt, AdminController.updateItems)

export default router;
