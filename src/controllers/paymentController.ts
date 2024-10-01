import { Request, Response } from "express";
import razorpayService from "../services/razorpayService";
import { chatService } from "../services/chatService";
import sharedServices from "../services/sharedService";

class PaymentController{
    // payment function
    static async payment(req:Request, res:Response){
        const {amount} = req.body
        if(!amount){
            return res.status(400).json({success:false, message:'bad request, amount is missing'})
        } 
        try {
            // business logic to create order for payment
            const result = await razorpayService.createOrder(amount)
            if(!result.success){
                return res.status(result.status).json({success:result.success, message:result.message})
            }
            return res.status(result.status).json({success:result.success,items:result.item, message:result.message})
        } catch (error) {
            return res.status(500).json({success:false, message:error})
        }
    }

    // payment verification after making payment in the client
    static async paymentVerify(req:Request, res:Response){
        const {userId, subscriptionId, packageId} = req.body
        try {
            // business logic for payment verification
            const result =  razorpayService.verifyPayment(req.body)
            if(!result.success){
                return res.status(result.status).json({success:result.success, message:result.message})
            }
            const newChat = await chatService.createRoom(userId)
            const subscription = await sharedServices.updateUserSubscription(userId, subscriptionId, packageId)
            
            return res.status(result.status).json({success:result.success, message:result.message})
        } catch (error) {
            return res.status(500).json({success:false, message:error})
        }
    }

}

export default PaymentController