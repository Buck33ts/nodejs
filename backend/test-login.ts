import express from 'express';
import dotenv from 'dotenv';
import { loginUser } from './scr/services/userService';

dotenv.config();

const app = express();
app.use(express.json());

// Test login endpoint
app.post('/api/users/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }
    
    const result = await loginUser(email, password);
    console.log('Login result:', result);
    
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
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Test login server running on port ${PORT}`);
  console.log(`Test endpoint: POST http://localhost:${PORT}/api/users/login`);
});
