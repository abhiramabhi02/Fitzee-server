import User, {userInterface} from "../models/userModel";
import Trainer, {trainerInterface} from "../models/trainerModel";
import Admin, {adminInterface} from "../models/adminModel";
import dotenv from 'dotenv'
import { tokenGeneration } from "./jwt";
import { securePassword, verifyPassword } from "../helpers/Hashing";
import mongoose from "mongoose";
import { verificationMail } from "../helpers/mailHelper";
import jwt, { JwtPayload }  from "jsonwebtoken";

dotenv.config()

export type Role = 'user' | 'trainer' | 'admin'

type RoleDocumentMap = {
    user: userInterface,
    trainer:trainerInterface,
    admin:adminInterface
}

class AuthService {
  private static getModel<T extends Role>(role: T) {
    switch (role) {
      case "user":
        return User as unknown as mongoose.Model<RoleDocumentMap[T]>;

      case "trainer":
        return Trainer as unknown as mongoose.Model<RoleDocumentMap[T]>;

      case "admin":
        return Admin as unknown as mongoose.Model<RoleDocumentMap[T]>;

        default:{
            throw new Error('invalid role')
        }
    }
  }

  static async Register<T extends Role>(data:{name:string, email:string, password:string}, role:T){

    const model = this.getModel(role)
    
    const user = await model.findOne({Email:data.email}).exec()
    if(user){
        return {status:401, success:false, message:'user already exists'}
    }

    const hashedPassword = await securePassword(data.password)

    const newUser = new model({
        Name:data.name,
        Email:data.email,
        Password:hashedPassword
    })

    const saved = await newUser.save()

    //for user sending verification mail on registration
    if(saved && role === 'user'){
      //token for verification
      const token = tokenGeneration({email:data.email})
      if(!token){
        return {status:500, success:false, message:'token generation failed'}
      }
      const verificationLink:string = process.env.verification_mail +`?token=` + token
      //sending mail to another route with token
     const verificationResult = await verificationMail(data.email, verificationLink)

      if(!verificationResult.success){
        return {status:verificationResult.status, success:verificationResult.success, message:verificationResult.message }
      }
    }
    return {status:201, success:true, message:`${role} registration succesful`}
  }

  static async Login<T extends Role>(data:{email:string, password:string}, role:T){

    const model =  this.getModel(role)

    const user = await model.findOne({Email:data.email}).exec() 

    if(!user){
        return {status:404, success:false, err:'noUser', message:`${role} not found`}
    }

    const isMatch = await verifyPassword(data.password, user.Password)

    if(!isMatch){
        return {status:401, success:false, err:'incorrectPassword', message:'incorrect password'}
    }

    if ((role === 'user' || role === 'trainer') && 'Verification' in user) {
      if (!user.Verification) {
          return { status: 403, success: false, message: 'User is not verified' };
      }
  }

    const token = tokenGeneration({userId:user._id})
    if(!token){
        return {status:500, success:false, err:'errToken', message:'unable to generate token'}
    }
    return {status: 200, success:true, user, token, message:'login successful'}
  }


  static async mailVerification(token:string){
    const decoded = jwt.verify(token, process.env.jwt_SecretKey as string) as JwtPayload
    const user = await User.findOne({Email:decoded.email})

    if(user && !user.Verification){
      user.Verification = true
      await user.save()
      return {status:200, success:true, message:'user mail verification successfull'}
    }else{
      return {status:400, success:true, message:'Verification failed or user already exists'}
    }
  }
}

export default AuthService