
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/boots2suits';

const checkDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully!');

    console.log('\n--- Current Users in Database ---');
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('No users found. Try signing up on the frontend!');
    } else {
      console.table(users.map((u: any) => ({ 
        Name: u.firstName + ' ' + u.lastName, 
        Email: u.email, 
        Role: u.role, 
        Created: u.createdAt 
      })));
    }
    
    console.log('\n---------------------------------');

  } catch (error) {
    console.error('❌ Error connecting to database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
};

checkDB();
