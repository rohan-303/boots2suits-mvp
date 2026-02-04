import mongoose from 'mongoose';
import process from 'process';

// Interface for the cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global type for caching
declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  const connString = process.env.MONGO_URI || process.env.COSMOS_DB_CONNECTION_STRING;

  if (!connString) {
    throw new Error('Database connection string is not defined. Please set MONGO_URI in .env');
  }

  if (cached.conn) {
    // console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering to fail fast if no connection
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(connString, opts).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};
