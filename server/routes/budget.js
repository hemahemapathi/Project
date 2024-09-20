import express from 'express';
import {
  createBudget,
  getBudget,
  updateBudget,
  deleteBudget,
  getAllBudgets,
  addExpense
} from '../controllers/budgetController.js';
import { authMiddleware } from '../routes/auth.js';

const router = express.Router();

router.route('/')
  .post(authMiddleware, createBudget)
  .get(authMiddleware, getAllBudgets);

router.route('/:id')
  .get(authMiddleware, getBudget)
  .put(authMiddleware, updateBudget)
  .delete(authMiddleware, deleteBudget);

router.route('/:id/expense')
  .post(authMiddleware, addExpense);

export default router;
