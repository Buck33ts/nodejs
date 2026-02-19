import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedAdmin } from './scr/utils/seedAdmin';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');
    
    // Seed admin user
    await seedAdmin();
    
    // Disconnect
    await mongoose.disconnect();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
