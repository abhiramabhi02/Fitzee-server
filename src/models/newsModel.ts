import mongoose, { model, Document } from "mongoose";

export interface newsInterface {
  Title: string;
  Description: string;
  Image: string;
  Status: boolean;
  InsertedDate: Date;
  LastUpdate: Date;
}

const news = new mongoose.Schema({
  Title: {
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

export default model<newsInterface>("news", news);
