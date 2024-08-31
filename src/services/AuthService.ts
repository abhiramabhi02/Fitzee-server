import User, {userInterface} from "../models/userModel";
import Trainer, {trainerInterface} from "../models/trainerModel";
import Admin, {adminInterface} from "../models/adminModel";

import { tokenGeneration } from "./jwt";
import { securePassword, verifyPassword } from "../helpers/Hashing";
import mongoose, { Model } from "mongoose";

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
        return {success:false, message:'user already exists'}
    }

    const hashedPassword = await securePassword(data.password)

    const newUser = new model({
        Name:data.name,
        Email:data.email,
        Password:hashedPassword
    })

    await newUser.save()
    return {success:true, message:`${role} registration succesful`}
  }

  static async Login<T extends Role>(data:{email:string, password:string}, role:T){

    const model =  this.getModel(role)

    const user = await model.findOne({Email:data.email}).exec()

    if(!user){
        return {status:404, success:false, err:'noUser', message:'user not found'}
    }

    const isMatch = await verifyPassword(data.password, user.Password)

    if(!isMatch){
        return {status:401, success:false, err:'incorrectPassword', message:'incorrect password'}
    }

    const token = tokenGeneration({userId:user._id})
    if(!token){
        return {status:500, success:false, err:'errToken', message:'unable to generate token'}
    }
    return {status: 200, success:true, user, token, message:'login successful'}
  }
}

export default AuthService