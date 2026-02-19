import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

export const requireAuth = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
      
      const user = decoded;
      
      // Check if user role is allowed
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
        });
      }
      
      (req as any).user = user;
      next();
    });
  };
};

export const authenticateToken = (req: Request, res: Response, next: any) => {
  console.log('Auth - Checking authentication...');
  const authHeader = req.headers['authorization'];
  console.log('Auth - Auth header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Auth - Token extracted:', token ? 'Present' : 'Missing');
  
  if (!token) {
    console.log('Auth - No token provided');
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      console.log('Auth - Token verification failed:', err.message);
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    console.log('Auth - Token verified, user:', decoded);
    (req as any).user = decoded;
    next();
  });
};

export const requireAdmin = requireAuth(['admin']);

export const requireMainCounselor = requireAuth(['admin', 'main_counselor']);

export const requireSchoolCounselor = requireAuth(['admin', 'main_counselor', 'school_counselor']);

export const requireTeacher = requireAuth(['admin', 'main_counselor', 'school_counselor', 'teacher']);

export const requireStudent = requireAuth(['admin', 'main_counselor', 'school_counselor', 'teacher', 'student']);

export const requireSameSchool = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    const user = decoded;
    const targetSchoolId = req.params.schoolId || req.body.schoolId;
    
    // Admin and main counselor can access all schools
    if (['admin', 'main_counselor'].includes(user.role)) {
      return next();
    }
    
    // Other roles must be from the same school
    if (user.schoolId !== targetSchoolId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Different school'
      });
    }
    
    (req as any).user = user;
    next();
  });
};
