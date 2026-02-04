import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import process from 'process';

dotenv.config();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

// Only start server if run directly (not imported by Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
