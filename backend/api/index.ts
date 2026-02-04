import app from '../src/app';
import { connectDB } from '../src/config/db';

export default async function handler(req: any, res: any) {
  // Ensure DB is connected before handling the request
  await connectDB();
  
  // Pass request to Express app
  return app(req, res);
}