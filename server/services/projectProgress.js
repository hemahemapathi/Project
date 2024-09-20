import { Project } from '../models/Project';
import { Task } from '../models/Task';

const calculateProjectProgress = async (projectId) => {
  try {
    const project = await Project.findById(projectId);
    const tasks = await Task.find({ project: projectId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;

    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      projectId,
      projectName: project.name,
      totalTasks,
      completedTasks,
      progress: Math.round(progress * 100) / 100, // Round to 2 decimal places
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status
    };
  } catch (error) {
    console.error('Error calculating project progress:', error);
    throw error;
  }
};

const updateProjectProgress = async (projectId) => {
  try {
    const progress = await calculateProjectProgress(projectId);
    await Project.findByIdAndUpdate(projectId, { progress: progress.progress });
    return progress;
  } catch (error) {
    console.error('Error updating project progress:', error);
    throw error;
  }
};

export default {
  calculateProjectProgress,
  updateProjectProgress
};