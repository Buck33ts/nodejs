import User from '../models/userModel';

export const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@anxiety.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@anxiety.com',
      password: 'admin123', 
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@anxiety.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
