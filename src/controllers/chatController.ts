import { Request, Response } from "express";
import { chatService } from "../services/chatService";

class ChatController{

  // get request for fetching the rooms of users and trainers
    static async getRoomsById(req:Request, res:Response):Promise<Response>{
        const {id, role} = req.params
        
        //checking necessary fields are present
        if(!id){
           return res.status(401).json({success:false, message:'id not found'})
        }
        // calling the business logic to fetch the rooms
        const result = await chatService.getRoomsOfUser(id, role)
        if(!result.success){
          return  res.status(result.status).json({success:result.success, message:result.message})
        }
       return res.status(result.status).json({success:result.success, items:result.data, message:result.message})
    }
}

export default ChatController