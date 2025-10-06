// lib/db.ts
import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return; // Prevent multiple connections
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to Database');
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed');
  }
};

export default connectDB;