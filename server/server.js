import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import teamMembersRoutes from './routes/teamMembers.js';
import dashboardRoutes from './routes/dashboard.js'
import reportRoutes from './routes/report.js'
import budgetRoutes from './routes/budget.js';
import { authMiddleware } from './routes/auth.js'; // Import authMiddleware


dotenv.config();
const app = express();

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to mongoDB.');
  } catch (error) {
    console.error('Error connecting to mongoDB:', error);
    throw error;
  }
};

// Handle MongoDB disconnection
mongoose.connection.on('disconnected', () => {
  console.log('mongoDB disconnected!');
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/user', userRoutes); // User routes
app.use('/api/projects', projectRoutes); // Project routes
app.use('/api/teamMembers', teamMembersRoutes); // Team Members routes
app.use('/api/dashboard',dashboardRoutes)//Dashboard routes
app.use('/api/reports',reportRoutes)//Report routes
app.use('/api/budgets', budgetRoutes);
// Error Handling
app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

// Example of a protected route using authMiddleware
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route.' });
});

// Global Error Handling
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong!';
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connect();
  console.log(`Server running on port ${PORT}`);
});
