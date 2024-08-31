import mongoose, { Document, model } from "mongoose";

export interface trainerInterface extends Document{
    Name:string,
    Email:string,
    Password:string,
    Verified:Boolean
}

const trainer = new mongoose.Schema({
    Name:{
        type:String, 
        required:true
    },
    Email:{
        type:String, 
        required:true
    },
    Password:{
        type:String, 
        required:true
    },
    Verified:{
        type:Boolean,
        default:false
    }
})

export default model<trainerInterface>('trainer', trainer)