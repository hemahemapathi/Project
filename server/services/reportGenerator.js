import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

export const generateProjectReport = async (projectId) => {
  const project = await Project.findById(projectId);
  const tasks = await Task.find({ project: projectId });
  const teamMembers = await User.find({ _id: { $in: project.team } });

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const progress = (completedTasks.length / tasks.length) * 100 || 0;

  return {
    projectName: project.name,
    description: project.description,
    startDate: project.startDate,
    endDate: project.endDate,
    status: project.status,
    progress: progress.toFixed(2),
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    teamSize: teamMembers.length,
    teamMembers: teamMembers.map(member => ({
      name: member.name,
      email: member.email,
      role: member.role
    }))
  };
};

export const generateTaskReport = async (projectId) => {
  const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name email');

  return tasks.map(task => ({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignedTo: task.assignedTo ? `${task.assignedTo.name} (${task.assignedTo.email})` : 'Unassigned',
    dueDate: task.dueDate,
    createdAt: task.createdAt
  }));
};

export const generateWorkloadReport = async (projectId) => {
  const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name');
  const workload = {};

  tasks.forEach(task => {
    const assigneeName = task.assignedTo ? task.assignedTo.name : 'Unassigned';
    workload[assigneeName] = (workload[assigneeName] || 0) + 1;
  });

  return Object.entries(workload).map(([name, taskCount]) => ({
    name,
    taskCount
  }));
};
