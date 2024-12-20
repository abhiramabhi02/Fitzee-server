import { Router } from "express";
import AdminController from "../controllers/adminController";
import { verifyJwt } from "../middlewares/jwt";
import adminModel from "../models/adminModel";

const router = Router();

// registration of admin, data contains in body
router.post("/register", AdminController.Registration);

// login of admin, data contains in body
router.post("/login", AdminController.login);

// get request for fetching all the data
router.get('/getdashboard', AdminController.getDashboard)

//get all news in admin console
router.get("/getitems", verifyJwt, AdminController.getItems);

//get request for fetching payment data in admin
router.get('/getpayments', verifyJwt, AdminController.getPaymentData)

//insert news in admin
router.post("/insertitems", verifyJwt, AdminController.insertItems);

// updating news in admin news management
router.put("/updateitems", verifyJwt, AdminController.updateItems);

//deleting a news
router.delete("/deleteitems", verifyJwt, AdminController.deleteItems);

//filtering admin listed particulars
router.post('/applyfilters', AdminController.filterOptions)

router.post('/getItembyId', verifyJwt, AdminController.getItemById)

export default router;
