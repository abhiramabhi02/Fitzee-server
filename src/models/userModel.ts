import mongoose, { Document, model } from "mongoose";

export interface personalDetails {
  Image: string;
  Gender: string;
  Age: string;
  Height: number;
  Weight: number;
}

export interface paymentInterface{
  OrderId:string,
  Date:Date
}

export interface userInterface {
  Verification: any;
  Name: string;
  Email: string;
  Password: string;
  Subscription: mongoose.Types.ObjectId;
  Package: mongoose.Types.ObjectId;
  Verified: Boolean;
  PersonalDetails: personalDetails;
  Diet: mongoose.Types.ObjectId;
  Payment: paymentInterface;
  JoinedDate:Date;
}

const personalDetailsSchema = new mongoose.Schema({
  Image: {
    type: String,
  },
  Gender: {
    type: String,
    required: true,
  },
  Age: {
    type: String,
    required: true,
  },
  Height: {
    type: Number,
    required: true,
  },
  Weight: {
    type: Number,
    required: true,
  },
});

const paymentSchema = new mongoose.Schema({
  OrderId: {
    type:String
  },
  Date:{
    type:Date,
    default:Date.now
  }
})

const user = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subscription",
  },
  Package:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "packages"
  },
  Verification: {
    type: Boolean,
    default: false,
  },
  PersonalDetails: {
    type: personalDetailsSchema,
  },
  Diet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "diet",
  },
  Payment:{
    type:paymentSchema
  },
  JoinedDate:{
    type:Date,
    default:Date.now
  }
});

export default model<userInterface>("user", user);
