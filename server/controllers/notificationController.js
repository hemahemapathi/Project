import { createTransport } from 'nodemailer';
import { findById } from '../models/User';
import { findById as _findById } from '../models/Project';
import { findById as __findById, find } from '../models/Task';

// Configure nodemailer transporter
const transporter = createTransport({
  // Add your email service configuration here
  // For example, using Gmail:
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendProjectAssignmentNotification(req, res) {
  try {
    const { projectId, userId } = req.body;
    const project = await _findById(projectId);
    const user = await findById(userId);

    if (!project || !user) {
      return res.status(404).json({ message: 'Project or User not found' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `You've been assigned to ${project.name}`,
      text: `Hello ${user.name},\n\nYou have been assigned to the project "${project.name}". Please log in to the project management tool for more details.\n\nBest regards,\nYour Project Management Team`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function sendTaskAssignmentNotification(req, res) {
  try {
    const { taskId, userId } = req.body;
    const task = await __findById(taskId).populate('project', 'name');
    const user = await findById(userId);

    if (!task || !user) {
      return res.status(404).json({ message: 'Task or User not found' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `New task assigned: ${task.title}`,
      text: `Hello ${user.name},\n\nYou have been assigned a new task "${task.title}" in the project "${task.project.name}". Please log in to the project management tool for more details.\n\nBest regards,\nYour Project Management Team`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function sendDeadlineReminderNotification(req, res) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasksWithUpcomingDeadlines = await find({
      deadline: {
        $gte: new Date(),
        $lt: tomorrow
      },
      status: { $ne: 'completed' }
    }).populate('assignedTo', 'name email').populate('project', 'name');

    for (const task of tasksWithUpcomingDeadlines) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: task.assignedTo.email,
        subject: `Deadline Reminder: ${task.title}`,
        text: `Hello ${task.assignedTo.name},\n\nThis is a reminder that the task "${task.title}" in the project "${task.project.name}" is due tomorrow. Please ensure it's completed on time.\n\nBest regards,\nYour Project Management Team`
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: 'Deadline reminders sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
