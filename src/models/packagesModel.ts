import mongoose from 'mongoose'

const packages = new mongoose.Schema({
    Packagename:{
        type:String,
        required:true
    },
    Exercises:{
        type: Array
    }
})