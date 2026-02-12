import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import process from 'process';

dotenv.config();

// Database connection is handled in startup
connectDB();

const PORT = process.env.PORT || 5000;

// Only start server if run directly (not imported by Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
