import mongoose, { Document, model } from "mongoose";

export interface personalDetails {
  Image: string;
  Gender: string;
  Age: number;
  Height: number;
  Weight: number;
}

export interface userInterface {
  Name: string;
  Email: string;
  Password: string;
  Subscription: Boolean;
  Verified: Boolean;
  PersonalDetails:personalDetails
}

const personalDetailsSchema = new mongoose.Schema({
  Image: {
    type: String,
  },
  Gender: {
    type: String,
    required:true
  },
  Age:{
    type:Number,
    required:true
  },
  Height: {
    type: Number,
    required:true
  },
  Weight: {
    type: Number,
    required:true
  },
});

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
    type: Boolean,
    default: false,
  },
  Verification: {
    type: Boolean,
    default: false,
  },
  PersonalDetails: {
    type:personalDetailsSchema
  }
});

export default model<userInterface>("user", user);