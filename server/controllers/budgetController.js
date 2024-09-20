import Budget from '../models/budget.js';
import asyncHandler from 'express-async-handler';

export const createBudget = asyncHandler(async (req, res) => {
  const { project, totalBudget } = req.body;

  const budget = await Budget.create({
    project,
    totalBudget,
    createdBy: req.user._id
  });

  res.status(201).json(budget);
});

export const getAllBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ createdBy: req.user._id });
  res.json(budgets);
});

export const getBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);
  
  if (budget) {
    res.json(budget);
  } else {
    res.status(404);
    throw new Error('Budget not found');
  }
});

export const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (budget) {
    budget.totalBudget = req.body.totalBudget || budget.totalBudget;
    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } else {
    res.status(404);
    throw new Error('Budget not found');
  }
});

export const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (budget) {
    await budget.remove();
    res.json({ message: 'Budget removed' });
  } else {
    res.status(404);
    throw new Error('Budget not found');
  }
});

export const addExpense = asyncHandler(async (req, res) => {
  const { description, amount } = req.body;
  const budget = await Budget.findById(req.params.id);

  if (budget) {
    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      return res.status(400).json({ message: 'Invalid expense amount. Please provide a positive number.' });
    }

    const newExpense = {
      description,
      amount: expenseAmount,
      date: Date.now()
    };

    budget.expenses.push(newExpense);
    budget.allocatedBudget += expenseAmount;

    const updatedBudget = await budget.save();
    res.status(201).json(updatedBudget);
  } else {
    res.status(404);
    throw new Error('Budget not found');
  }
});
