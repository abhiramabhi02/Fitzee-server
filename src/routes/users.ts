import { Router } from 'express';
import userController from '../controllers/userController'
import { verifyJwt } from '../services/jwt';
import AdminController from '../controllers/adminController';
import PaymentController from '../controllers/paymentController';

const router = Router();


// post request for registration contains [url, headers, body]
router.post('/register', userController.Registration)

//get request for mail verification after registration
router.get('/mailverification', userController.userMailVerification)

// post request for login contains [url, headers, body]
router.post('/login', userController.login)
   
//get request to fetch all the news
router.get('/getitems', AdminController.getItems)

// post request for user profile completion
router.put('/profilecompletion', verifyJwt, userController.userProfileCompletion)

// get request to fetch user by id
router.get('/getuserbyid', verifyJwt, userController.getUserbyId)

//post request to fetch items by id
router.post('/getitemsbyid', verifyJwt, userController.getItemsById)

// post request to initiate payment
router.post('/payment', verifyJwt, PaymentController.payment)

// post request for payment verification
router.post('/paymentverify', verifyJwt, PaymentController.paymentVerify)

//post request for forgot password
router.post('/forgotpassword', userController.forgotpasswordLink)

router.post('/resetpassword', userController.resetUserPassword)
   

export default router;
