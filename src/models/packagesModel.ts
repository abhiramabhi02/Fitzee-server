import mongoose, { model } from 'mongoose'

export interface PackageInterface{
    PackageName:string;
    Description:string
    Exercises:Array<object>;
    Subscription:Object
}

const packages = new mongoose.Schema({
    Packagename:{
        type:String,
        required:true
    },
    Description:{
        type:String
    },
    Exercises:{
        type: Array
    },
    Subscription:{
        type:Object
    }
})

export default model<PackageInterface>('packages', packages)

