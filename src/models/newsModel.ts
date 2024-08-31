import mongoose, { model, Document } from "mongoose";

export interface newsInterface {
    Title:string,
    Description:string,
    Image:string
}

const news = new mongoose.Schema({
    Title:{
        type:String, 
        required:true
    },
    Description:{
        type:String, 
        required:true
    },
    Image:{
        type:String, 
    }
})

export default model<newsInterface>('news', news)