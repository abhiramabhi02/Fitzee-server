import mongoose, { model } from "mongoose";
import { Document } from "mongoose";

interface message {
  Message: string;
  SenderId: string;
  Read:boolean
  TimeStamp: Date;
}

interface chatInterface extends Document {
  UserId: mongoose.Types.ObjectId;
  TrainerId: mongoose.Types.ObjectId;
  UserOnline:boolean;
  TrainerOnline:boolean;
  Messages: message[];
}

const messageSchema = new mongoose.Schema({
  Message: {
    type: String,
    required: true,
  },
  SenderId: {
    type: String,
    required: true,
  },
  Read:{
    type:Boolean,
    default: false,
  },
  TimeStamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Types.ObjectId,
    ref:"user",
    required: true,
  },
  TrainerId: {
    type: mongoose.Types.ObjectId,
    ref:"trainer",
    required: true,
  },
  UserOnline:{
    type:Boolean,
    default:false
  },
  TrainerOnline:{
    type:Boolean,
    default: false
  },
  Messages: {
    type: [messageSchema],
    default: [],
  },
});

const Chat = model<chatInterface>('chat', ChatSchema)

export default Chat