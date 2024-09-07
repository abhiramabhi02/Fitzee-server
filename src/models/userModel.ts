import mongoose, { Document, model } from "mongoose";

export interface userInterface {
  Name: string;
  Email: string;
  Password: string;
  Subscription: Boolean;
  Verified: Boolean;
}

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
});

export default model<userInterface>("user", user);
