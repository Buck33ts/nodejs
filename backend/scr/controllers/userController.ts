import { Request, Response } from 'express';
import { registerUser, loginUser, getUserById, getAllUsers } from '../services/userService';

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Register - Request body:', req.body);
    
    const { name, email, password, role, anxietyLevel, preferences, schoolId, programId } = req.body;
    
    // Validate role
    const validRoles = ['admin', 'main_counselor', 'school_counselor', 'teacher', 'student'];
    if (role && !validRoles.includes(role)) {
      console.log('Register - Invalid role:', role);
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }
    
    // Only admin can create admin or main_counselor roles
    const requestingUser = (req as any).user;
    if (requestingUser?.role !== 'admin' && ['admin', 'main_counselor'].includes(role)) {
      console.log('Register - Unauthorized role creation attempt:', role, 'by user:', requestingUser?.role);
      return res.status(403).json({
        success: false,
        message: 'Only admin can create admin or main counselor accounts'
      });
    }
    
    console.log('Register - Creating user with data:', {
      name,
      email,
      role: role || 'student',
      anxietyLevel,
      preferences,
      schoolId,
      programId,
      isActive: true
    });
    
    const userData: any = {
      name,
      email,
      password,
      role: role || 'student',
      anxietyLevel,
      preferences,
      schoolId,
      programId,
      isActive: true
    };
    
    console.log('Register - Final user data:', userData);
    
    const user = await registerUser(userData);
    console.log('Register - User created:', user);
    
    // Remove password from response
    const userObj = user as any;
    const userWithoutPassword = { ...userObj };
    delete userWithoutPassword.password;
    
    console.log('Register - Response data:', {
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (error: any) {
    console.error('Register - Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const result = await loginUser(email, password);
    
    // Remove password from response
    const userObj = result.user as any;
    const userWithoutPassword = { ...userObj };
    delete userWithoutPassword.password;
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token: result.token
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Remove password from response
    const userObj = user as any;
    const userWithoutPassword = { ...userObj };
    delete userWithoutPassword.password;
    
    res.status(200).json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get profile'
    });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all users...');
    const users = await getAllUsers();
    console.log('Users found:', users.length);
    console.log('First user structure:', users[0] ? JSON.stringify(users[0], null, 2) : 'No users');
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const userObj = user as any;
      const userWithoutPassword = { ...userObj };
      delete userWithoutPassword.password;
      return userWithoutPassword;
    });
    
    res.status(200).json({
      success: true,
      users: usersWithoutPasswords
    });
  } catch (error: any) {
    console.error('Error in getAllUsersController:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get users'
    });
  }
};
