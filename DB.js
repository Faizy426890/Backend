import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const uri = process.env.MONGODB_URI;

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
