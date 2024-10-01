import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { Role } from "../services/AuthService";
import adminServices, { Particular } from "../services/adminServices";
import mongoose from "mongoose";
import { promises } from "fs";
import items from "razorpay/dist/types/items";


const role: Role = 'admin'


class AdminController {

  // admin registration contains [name, email, password, cpassword] in the body
    static async Registration(req:Request, res:Response): Promise<Response>{
        const { name, email, password, cpassword } = req.body;
      
        //checking all the fields are present
        if (!name || !email || !password || !cpassword) {
            return res.status(400).json({  success: false, message: "All fields are required."});
        }
    
        //checking password matches with confirm password
        if (password !== cpassword) {
            return res.status(403).json({success: false, message: "Password and confirm password do not match."});
        }

        try {
          // call the Register function in AuthService to execute the business logic
            const result =  await AuthService.Register({name, email, password}, role)
            if(!result.success){
                return res.status(result.status).json({success: result.success, message: result.message});    
            }
    
            return res.status(result.status).json({success: result.success, message: result.message});
    
        } catch (error) {
            return res.status(500).json({success: false, message: "Internal server error. Please try again later."});
        }
    }

    // login function, contains [email and password] in body
    static async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
      // checking fields are present
        if (!email || !password) {
          return res.status(400).json({ success: false, message: "email and password are required" });
        }
        try {
          // calling Login function in Authservice to execute business logic
          const result = await AuthService.Login({email, password}, role)
          if(!result.success){
            return res.status(result.status).json({ success: false, message: result.message });
          }
          return res.status(200).json({ success: true, user:result.user, token:result.token,  message: result.message });
  
      } catch (error) {
        return res.status(500).json({ success: false, message: error, err:'failed' });      
      }
      }

      // function to fetch all the documents from the collection 
      // contains item (particular) in req query
      static async getItems(req:Request, res:Response):Promise<Response>{
        const {item} = req.query
        
       try {
        // executing business logic, calling function
        const result = await adminServices.getAllItems(item as Particular)
        if(!result.success){
          return res.status(result.status).json({success:result.success, message:result.message})
        }
        return res.status(result.status).json({success:result.success, items:result.items, message:result.message})
       } catch (error) {
         return res.status(500).json({ success: false, message: 'Error fetching items', err:error  });
       }
      }

      // insert new news contains data [title, description, image]
      static async insertItems(req:Request, res:Response):Promise<Response>{     
        const {item} = req.body
        
        try {  
          
          if(item === 'package'){
            const exercises = req.body.exercises.map((id:string) => new mongoose.Types.ObjectId(id))
            const subscription = new mongoose.Types.ObjectId(req.body.subscription)
            req.body.exercises = exercises
            req.body.subscription = subscription
          }
          
        // executing business logic, calling function
        const itemData = adminServices.itemAlign(item, req.body)
        if(!itemData.success){
          return res.status(itemData.status).json({success:itemData.success, message:itemData.message})
        }
        const result = await adminServices.insertItem(itemData.data, item as Particular)
        if(!result.success){
          return res.status(result.status).json({ success: result.success, message: result.message });
        }
        return res.status(result.status).json({ success: result.success, item:result.item, message: result.message });
        } catch (error) {
          return res.status(500).json({ success: false, message: error  });
        } 
       
      }

      // update existing documents calling service for update
      // contains [item, itemId, updation Data]
      static async updateItems(req:Request, res:Response):Promise<Response>{
        // the updateData, which contains the fields for updation, should always 
        // start with capital letter eg: Title, Description.
        const {item, id, ...updateData} = req.body

        if(!item || !id || !updateData){
          return res.status(400).json({ success: false, message: "bad request particular, id and updation fields are required" });
        }
        //executing business logic
        const result = await adminServices.updateItem(id, updateData, item as Particular)
        if(!result?.success){
          return res.status(result.status).json({ success: result.success, message: result.message });  
        }
        return res.status(result.status).json({ success: result.success, message: result.message });
      }

      // delete a document in a collection, calling deleting service
      static async deleteItems(req:Request, res:Response):Promise<Response>{
        const {id, item} = req.query
        
        if(!id){
          return res.status(400).json({ success: false, message: "bad request, item Id is not present" });
        }

        //executing business logic, the item is particular, such as news, exercise etc
        const result = await adminServices.deleteItem(id as string, item as Particular)   
        if(!result?.success){
          return res.status(result.status).json({ success: result.success, message: result.message });
        }
        return res.status(result.status).json({ success: result.success, message: result.message });
      }

      static async getPaymentData(req:Request, res:Response){
        try {
          const result = await adminServices.getPaymentDetails()
          if(!result.success){
            return res.status(result.status).json({ success: result.success, message: result.message });
          }
          return res.status(result.status).json({ success: result.success, items:result.item, message: result.message });
        } catch (error) {
          return res.status(500).json({ success: false, message: error  });
        }
      }

}

export default AdminController