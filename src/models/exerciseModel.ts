import mongoose, { Document, model } from "mongoose";

export interface exerciseInterface {
  Name: string;
  Description: string;
  Sets: number;
  Reps: number;
  Image: string;
  Status: boolean;
  InsertedDate: Date;
  LastUpdate: Date;
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
  Sets: {
    type: Number,
    default: 3,
  },
  Reps: {
    type: Number,
    default: 12,
  },
  Image: {
    type: String,
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

export default model<exerciseInterface>("exercise", exercise);
