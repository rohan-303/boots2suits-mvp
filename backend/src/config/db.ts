import mongoose from 'mongoose';

// Cache the connection for serverless environments (Vercel)
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    // Prioritize MONGO_URI, fallback to COSMOS_DB_CONNECTION_STRING if needed in future
    const connString = process.env.MONGO_URI || process.env.COSMOS_DB_CONNECTION_STRING;
    
    if (!connString) {
      throw new Error('Database connection string is not defined. Please set MONGO_URI in .env');
    }

    const conn = await mongoose.connect(connString);
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Target Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    // Don't exit process in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};
