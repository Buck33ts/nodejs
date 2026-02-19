import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', port: process.env.PORT });
});

// Test login endpoint
app.post('/test-login', (req, res) => {
  console.log('Request body:', req.body);
  res.json({ 
    message: 'Test login endpoint working',
    body: req.body 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/test`);
  console.log(`  POST http://localhost:${PORT}/test-login`);
});
