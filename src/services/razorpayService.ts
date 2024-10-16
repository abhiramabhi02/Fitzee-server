import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import Chat from "../models/chatModel";
dotenv.config();

class razorpayService {
  static async createOrder(amount: number) {
    const instance = new Razorpay({
      key_id: process.env.razorpay_key as string,
      key_secret: process.env.razorpay_secret as string,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "Receipt#1",
    }; 

    const order = await instance.orders.create(options);
    if (!order) {
      return {
        status: 406,
        success: false,
        message: "payment order creation failed",
      };
    }
    return {
      status: 200,
      success: true,
      item: order,
      message: "payment order creation successful",
    };
  }

  static verifyPayment(body: any) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;
    const key_secret = process.env.razorpay_secret!;
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const generatedSignature = hmac.digest('hex')

    if(!generatedSignature === razorpay_signature){
        return {status:400, success:false, message:'payment verification failed'}
    }
    return {status:200, success:true, message:'payment Completed'}
  }
}

export default razorpayService;
