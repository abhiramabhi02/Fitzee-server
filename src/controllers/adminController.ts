import Admin from "../models/adminModel";
import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { Role } from "../services/AuthService";
import adminServices, { Particular } from "../services/adminServices";
import { newsInterface } from "../models/newsModel";
import { exerciseInterface } from "../models/exerciseModel";


const role: Role = 'admin'


class AdminController {


  static async test(req: Request, res: Response): Promise<void> {
    const { item } = req.body;

    // Call the itemAlign method  
    const result = adminServices.itemAlign(item, req.body);
    console.log(result);

    // Check if itemAlign returned an error
    if (!result.success) {
      res.status(result.status).json({ success: false, message: result.message });
      return;
    }

    // If success, return the success response
    res.status(result.status).json({ success: true, data: result.data });
  }

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
                return res.status(401).json({success: false, message: result.message});    
            }
    
            return res.status(201).json({success: true, message: "Registration successful."});
    
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
          return res.status(200).json({ success: true, user:result.user, token:result.token,  message: 'User login successful.' });
  
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
        return res.status(result.status).json({success:result.success, news:result.items, message:result.message})
       } catch (error) {
         return res.status(500).json({ success: false, message: error, err:'failed' });
       }
      }

      // insert new news contains data [title, description, image]
      static async insertItems(req:Request, res:Response):Promise<Response>{     
        const {item} = req.body

        // executing business logic, calling function
        const itemData = adminServices.itemAlign(item, req.body)
        const result = await adminServices.insertItem(itemData.data, item as Particular)
        if(!result.success){
          return res.status(result.status).json({ success: result.success, message: result.message });
        }
        return res.status(result.status).json({ success: result.success, item:result.item, message: result.message });
      }

      // update existing documents calling service for update
      // contains [item, itemId, updation Data]
      static async updateItems(req:Request, res:Response):Promise<Response>{
        // the updateData, which contains the fields for updation, should always 
        // start with capital letter eg: Title, Description.
        const {item, id, ...updateData} = req.body
        if(!updateData){
          return res.status(400).json({ success: false, message: "updation fields are required" });
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
        const {id, item} = req.body
        if(!id){
          return res.status(400).json({ success: false, message: "item Id is not present" });
        }

        //executing business logic, the item is particular, such as news, exercise etc
        const result = await adminServices.deleteItem(id, item as Particular)   
        if(!result?.success){
          return res.status(result.status).json({ success: result.success, message: result.message });
        }
        return res.status(result.status).json({ success: result.success, message: result.message });
      }

}

export default AdminController