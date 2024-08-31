import mongoose, { model } from "mongoose";

export interface SubscriptionInterface{
    Name:String;
    Features:Array<string>;
    Price:Object
}

const subscription = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Features:{
        type:Array,
        required:true
    },
    Price: {
        type:Object,
        required:true
    }
})

export default model<SubscriptionInterface>('subscription', subscription)