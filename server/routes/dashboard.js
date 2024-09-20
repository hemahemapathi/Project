import express from 'express';
import { getDashboard, getDashboardData } from '../controllers/dashboardController.js';
import { authMiddleware } from '../routes/auth.js';


const router = express.Router();
router.get('/', authMiddleware, getDashboard);
  
router.get('/data', authMiddleware, getDashboardData);

export default router;
