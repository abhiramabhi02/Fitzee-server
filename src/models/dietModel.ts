import mongoose, { model } from "mongoose";

export interface dietInterface{
    UserId:mongoose.Types.ObjectId;
    Calories: number;
    Protein: number;
    Carbohydrate:number;
}

const diet = new mongoose.Schema({
    UserId: {
        type:mongoose.Types.ObjectId,
        required:true
    },
    Calories:{
        type:Number,
        required:true
    },
    Protein:{
        type:Number,
        required:true
    },
    Carbohydrate:{
        type:Number,
        required:true
    },
})

export default model<dietInterface>('diet', diet)