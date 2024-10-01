import mongoose, { Document, model } from "mongoose";

export interface trainerInterface extends Document {
  Image: string;
  Name: string;
  Email: string;
  Password: string;
  Verification: Boolean;
}

const trainer = new mongoose.Schema({
  Image: {
    type: String,
  },
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
  Verification: {
    type: Boolean,
    default: false,
  },
});

export default model<trainerInterface>("trainer", trainer);
