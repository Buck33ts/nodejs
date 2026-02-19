import User, { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";

export const registerUser = async (userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> => {
  try {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const user = await User.create(userData);
    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to register user');
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ email, isActive: true });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '7d' }
    );
    
    return { user, token };
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  try {
    return await User.findOne({ _id: userId, isActive: true });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user');
  }
};

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const users = await User.find({ isActive: true });
    // Convert Mongoose documents to plain objects
    const plainUsers = users.map(user => {
      const userObj = user.toObject();
      delete userObj?.password; // Remove password for security
      return userObj;
    });
    return plainUsers;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get users');
  }
};

export const updateUserRole = async (userId: string, role: 'admin' | 'user'): Promise<IUser | null> => {
  try {
    return await User.findByIdAndUpdate(userId, { role }, { new: true });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update user role');
  }
};
