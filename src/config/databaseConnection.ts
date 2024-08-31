import mongoose from 'mongoose'


const connectDb = async () => {
    try {
      await mongoose.connect('mongodb://0.0.0.0:27017/fitzee');
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1); // Exit the process if the database connection fails
    }
  };

export default connectDb