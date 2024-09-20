import express from 'express';
import * as reportController from '../controllers/reportController.js';
import { authMiddleware } from './auth.js';

const router = express.Router();

// Generate a new report
router.post('/generate/:projectId', authMiddleware, reportController.generateReport);

// Get all reports for a project
router.get('/project/:projectId', authMiddleware, reportController.getReports);

// Get a specific report
router.get('/:id', authMiddleware, reportController.getReportById);

// Download a report
router.get('/:id/download', authMiddleware, reportController.downloadReport);

export default router;

