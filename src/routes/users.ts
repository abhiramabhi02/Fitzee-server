import { Router } from 'express';
import userController from '../controllers/userController'
import { Request, Response } from 'express';
import { verifyJwt } from '../services/jwt';

const router = Router();


// post request for registration contains [url, headers, body]
router.post('/register', userController.Registration)

// post request for login contains [url, headers, body]
router.post('/login', userController.login)

//get request for fetch all exercises 
router.get('/exercise', verifyJwt, userController.getAllExercises)


export default router;
