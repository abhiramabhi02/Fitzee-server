import mongoose, { Document, model } from "mongoose";

export interface exerciseInterface {
  Name: string;
  Description: string;
  Image: string;
}

const exercise = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
  },
});

export default model<exerciseInterface>('exercise', exercise)
