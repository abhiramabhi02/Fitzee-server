import mongoose, { model, Document } from "mongoose";

export interface adminInterface extends Document{
    Name:string,
    Email:string,
    Password:string
}

const admin = new mongoose.Schema({
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
    }
})

export default model<adminInterface>('admin', admin)