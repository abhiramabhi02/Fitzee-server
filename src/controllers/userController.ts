import { query, Request, Response } from "express";
import User from "../models/userModel";
import { securePassword, verifyPassword } from "../services/Hasing";
import { tokenGeneration, verifyJwt } from "../services/jwt";
import AuthService from "../services/AuthService";
import { Role } from "../services/AuthService";
import {Roles} from "../services/sharedService"
import adminServices, { Particular } from "../services/adminServices";
import sharedServices from "../services/sharedService";

const role:Role = 'user'
const userRole:Roles = 'user'

class UserController {

  // user registration contains [name, email, password, cpassword] in body
  static async Registration(req:Request, res:Response): Promise<Response>{
    const { name, email, password, cpassword } = req.body;

    // checking all fields are present
    if (!name || !email || !password || !cpassword) {
        return res.status(400).json({  success: false, message: "All fields are required."});
    }
    // checking password and confirm password
    if (password !== cpassword) {
        return res.status(403).json({success: false, message: "Password and confirm password do not match."});
    }
    try {
      // calling the Authservice to execute business logic of registration
        const result =  await AuthService.Register({name, email, password}, role)
        if(!result.success){
            return res.status(401).json({success: false, message: result.message});    
        }
        return res.status(201).json({success: true, message: "Registration successful."});
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error. Please try again later."});
    }
}

  // login function contains [email, password] to verify
  static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    // checking email and password are present
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email and password is not present" });
    }
    try {
      // calling the login function to execute business logic
        const result = await AuthService.Login({email, password}, role)
        if(!result.success){
          return res.status(result.status).json({ success: false, message: result.message });
        }
        return res.status(200).json({ success: true, user:result.user, token:result.token,  message: 'User login successful.' });

    } catch (error) {
      return res.status(500).json({ success: false, message: error, err:'failed' });      
    }
  }


  // post request to add user profile informations
  static async userProfileCompletion(req:Request, res:Response){
    const {id} = req.body
    if(!id){
     return res.status(400).json({success:false, message:"bad request, id not present"})
    }

    try {
      const itemData = adminServices.itemAlign('user', req.body)
      if(!itemData.success){
        return res.status(itemData.status).json({success:itemData.success, message:itemData.message})
      }
      console.log('called inside', itemData);
     const result = await sharedServices.profileCompletion(id, userRole, itemData.data)
     if(!result.success){
      return res.status(result.status).json({ success: result.success, message: result.message });  
     }
     return res.status(result.status).json({ success: result.success, message: result.message });
    } catch (error) {
     return res.status(500).json({success: false, message:error})
    }
  }

  static async getUserbyId(req:Request, res:Response){
    const {id} = req.query
    
    if(!id){
      return res.status(400).json({success:false, message:'bad request'})
    }

    try {
      const result = await sharedServices.getUserById(id as string)
      if(!result.success){
        return res.status(result.status).json({ success: result.success, message: result.message });  
      }
      return res.status(result.status).json({ success: result.success, user:result.user, message: result.message });
    } catch (error) {
     return res.status(500).json({success: false, message:error})
    }
  }

  
}


export default UserController;
