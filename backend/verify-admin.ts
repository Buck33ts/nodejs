import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './scr/models/userModel';

dotenv.config();

const verifyAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@anxiety.com' });
    
    if (admin) {
      console.log('✅ Admin user found:');
      console.log('ID:', admin._id);
      console.log('Name:', admin.name);
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Active:', admin.isActive);
      console.log('Created:', admin.createdAt);
    } else {
      console.log('❌ Admin user not found');
    }
    
    // Show all users
    const allUsers = await User.find({});
    console.log(`\nTotal users in database: ${allUsers.length}`);
    
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

verifyAdmin();
