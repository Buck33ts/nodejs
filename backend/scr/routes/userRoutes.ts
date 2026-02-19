import { Router } from 'express';
import { register, login, getProfile, getAllUsersController } from '../controllers/userController';
import { authenticateToken, requireAdmin, requireMainCounselor, requireSchoolCounselor, requireTeacher, requireStudent } from '../middlewares/auth';

const router = Router();

// Test route to check if routing works
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

// Debug route without authentication
router.post('/register-debug', (req, res) => {
  console.log('Debug - Request received at /register-debug');
  console.log('Debug - Request body:', req.body);
  console.log('Debug - Request headers:', req.headers);
  res.json({ message: 'Debug route working!', body: req.body });
});

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.get('/all', authenticateToken, requireAdmin, getAllUsersController);

// Admin registration route (for admin panel)
router.post('/register', authenticateToken, requireAdmin, (req, res) => {
  console.log('Auth - User authenticated:', (req as any).user);
  console.log('Auth - User role:', (req as any).user?.role);
  console.log('Auth - Request body:', req.body);
  return register(req, res);
});

// Role-based registration endpoints (optional - for future use)
router.post('/register/student', authenticateToken, requireSchoolCounselor, register);
router.post('/register/teacher', authenticateToken, requireSchoolCounselor, register);
router.post('/register/school-counselor', authenticateToken, requireMainCounselor, register);

// Role-based redirect route
router.post('/redirect', authenticateToken, (req, res) => {
  const user = (req as any).user;
  console.log('Redirect - User role:', user?.role);
  console.log('Redirect - Full user object:', JSON.stringify(user, null, 2));
  
  if (!user) {
    console.log('Redirect - No user found');
    return res.status(401).json({
      success: false,
      message: 'User not found'
    });
  }

  // Define role-based redirects
  const roleRedirects: { [key: string]: string } = {
    'admin': '/admin/dashboard',
    'main_counselor': '/admin/dashboard', 
    'school_counselor': '/counselor',
    'teacher': '/teacher',
    'student': '/student'
  };

  const redirectUrl = roleRedirects[user?.role || 'student'] || '/student';
  
  console.log('Redirect - User role detected:', user?.role);
  console.log('Redirect - Redirecting to:', redirectUrl);
  console.log('Redirect - Available redirects:', Object.keys(roleRedirects));
  
  res.status(200).json({
    success: true,
    redirectUrl,
    message: `Redirecting to ${user?.role} dashboard`,
    debug: {
      userRole: user?.role,
      redirectUrl,
      availableRedirects: roleRedirects
    }
  });
});

export default router;
