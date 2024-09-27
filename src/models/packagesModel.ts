import mongoose, { model } from "mongoose";

export interface PackageInterface {
  Packagename: string;
  Description: string;
  Exercises: mongoose.Types.ObjectId[];
  Subscription: mongoose.Types.ObjectId;
  Status: boolean;
  InsertedDate: Date;
  LastUpdate: Date;
}

const packages = new mongoose.Schema({
  Packagename: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
  },
  Exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "exercise", 
  }],
  Subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subscription",
  },
  Status: {
    type: Boolean,
    default: true,
  },
  InsertedDate: {
    type: Date,
    default: Date.now,
  },
  LastUpdate: {
    type: Date,
    default: Date.now,
  },
});

export default model<PackageInterface>("packages", packages);
