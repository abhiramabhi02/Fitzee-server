import mongoose from 'mongoose'
import dotenv from "dotenv"
dotenv.config()

const connectDb = async () => {
    try {
      await mongoose.connect(process.env.mongodb_connection as string);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1); 
    }
  };

export default connectDb