// config/db.js
import mongoose from 'mongoose';
import { ENV_VARS } from './envVars.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_VARS.MONGO_URI, {
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connectin to MongoDB:', error.message);
    process.exit(1); // Dừng server khi kết nối thất bại
  }
};


