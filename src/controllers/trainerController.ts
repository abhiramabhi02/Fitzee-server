import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { Role } from "../services/AuthService";
import adminServices from "../services/adminServices";
import { body } from "express-validator";

const role:Role = 'trainer'

class TrainerController{
  
    static async Registration(req:Request, res:Response): Promise<Response>{
        const { name, email, password, cpassword } = req.body;
    
        if (!name || !email || !password || !cpassword) {
            return res.status(400).json({  success: false, message: "All fields are required."});
        }
    
        if (password !== cpassword) {
            return res.status(403).json({success: false, message: "Password and confirm password do not match."});
        }
    
        try {
            
            const result =  await AuthService.Register({name, email, password}, role)
            if(!result.success){
                return res.status(401).json({success: false, message: result.message});    
            }
    
            return res.status(201).json({success: true, message: "Registration successful."});
    
        } catch (error) {
            return res.status(500).json({success: false, message: "Internal server error. Please try again later."});
        }
    }


    static async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
    
        if (!email || !password) {
          return res.status(400).json({ success: false, message: "email and password are required" });
        }
         try {
        const result = await AuthService.Login({email, password}, role)
        if(!result.success){
          return res.status(result.status).json({ success: false, message: result.message });
        }
        return res.status(200).json({ success: true, user:result.user, token:result.token,  message: 'User login successful.' });

    } catch (error) {
      return res.status(500).json({ success: false, message: error, err:'failed' });      
    }
      }

      static async setUserDiet(req:Request, res:Response){
        const {item, UserId } = req.body
        
        try {
                const alignedItems = adminServices.itemAlign(item, req.body)
                const result = await adminServices.insertItem(alignedItems.data, item)
                if(!result.success){

                    return res.status(result.status).json({ success: false, message: result.message });
                }
                const updateData = {
                    Diet: result.item._id
                }
                const updateUser = await adminServices.updateItem(UserId, updateData, 'user')
                if(!updateUser.success){

                    return res.status(updateUser.status).json({ success: false, message: updateUser.message });
                }
                return res.status(201).json({success:true, message:'diet inserted'})
            
        } catch (error) {
            return res.status(500).json({ success: false, message: error, err:'failed' });      
        }
      }
      
 }


export default TrainerController