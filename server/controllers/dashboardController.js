import asyncHandler from 'express-async-handler';
import Dashboard from '../models/Dashboard.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await Dashboard.findOne({ user: req.user._id });
  if (dashboard) {
    res.json(dashboard);
  } else {
    res.status(404);
    throw new Error('Dashboard not found');
  }
});

export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const openTasks = await Task.find({ assignedTo: userId, status: { $ne: 'completed' } }).exec();
  const closedTasks = await Task.find({ assignedTo: userId, status: 'completed' }).exec();

  await Task.populate(openTasks, { path: 'project', select: 'name' });
  await Task.populate(closedTasks, { path: 'project', select: 'name' });

  const projects = await Project.find({ members: userId }).exec();
  const projectTimeline = projects.map(project => ({
    name: project.name,
    startDate: project.startDate,
    endDate: project.endDate,
    progress: calculateProjectProgress(project)
  }));

  const totalTasks = openTasks.length + closedTasks.length;
  const overallProgress = totalTasks > 0 ? (closedTasks.length / totalTasks) * 100 : 0;

  res.json({
    openTasks,
    closedTasks,
    projectTimeline,
    overallProgress
  });
});

function calculateProjectProgress(project) {
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
  return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
}