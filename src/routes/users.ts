import { Router } from 'express';
import userController from '../controllers/userController'
import { Request, Response } from 'express';
import { verifyJwt } from '../services/jwt';
import AdminController from '../controllers/adminController';
import PaymentController from '../controllers/paymentController';

const router = Router();


// post request for registration contains [url, headers, body]
router.post('/register', userController.Registration)

// post request for login contains [url, headers, body]
router.post('/login', userController.login)

//get request to fetch all the news
router.get('/getitems', AdminController.getItems)

// post request for user profile completion
router.post('/profilecompletion', verifyJwt, userController.userProfileCompletion)

// get request to fetch user by id
router.get('/getuserbyid', verifyJwt, userController.getUserbyId)

// post request to initiate payment
router.post('/payment', verifyJwt, PaymentController.payment)

// post request for payment verification
router.post('/paymentverify', verifyJwt, PaymentController.paymentVerify)
   

export default router;
