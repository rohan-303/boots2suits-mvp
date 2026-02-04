import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Prioritize MONGO_URI, fallback to COSMOS_DB_CONNECTION_STRING if needed in future
    const connString = process.env.MONGO_URI || process.env.COSMOS_DB_CONNECTION_STRING;
    
    if (!connString) {
      throw new Error('Database connection string is not defined. Please set MONGO_URI in .env');
    }

    const conn = await mongoose.connect(connString);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Target Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
