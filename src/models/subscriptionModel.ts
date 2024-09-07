import mongoose, { model } from "mongoose";

export interface SubscriptionInterface {
  Name: String;
  Features: Array<string>;
  Price: Number;
  Status: boolean;
  InsertedDate: Date;
  LastUpdate: Date;
}

const subscription = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Features: {
    type: Array,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
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

export default model<SubscriptionInterface>("subscription", subscription);
