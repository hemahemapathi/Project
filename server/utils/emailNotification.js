import { createTransport } from 'nodemailer';

// Create a transporter using SMTP
const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Project Management Tool" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Function to send project assignment notification
const sendProjectAssignmentNotification = async (user, project) => {
  const subject = `You've been assigned to ${project.name}`;
  const text = `Hello ${user.name},\n\nYou have been assigned to the project "${project.name}". Please log in to the project management tool for more details.\n\nBest regards,\nYour Project Management Team`;
  const html = `<p>Hello ${user.name},</p><p>You have been assigned to the project "${project.name}". Please log in to the project management tool for more details.</p><p>Best regards,<br>Your Project Management Team</p>`;

  return sendEmail(user.email, subject, text, html);
};

// Function to send task assignment notification
const sendTaskAssignmentNotification = async (user, task, project) => {
  const subject = `New task assigned: ${task.title}`;
  const text = `Hello ${user.name},\n\nYou have been assigned a new task "${task.title}" in the project "${project.name}". Please log in to the project management tool for more details.\n\nBest regards,\nYour Project Management Team`;
  const html = `<p>Hello ${user.name},</p><p>You have been assigned a new task "${task.title}" in the project "${project.name}". Please log in to the project management tool for more details.</p><p>Best regards,<br>Your Project Management Team</p>`;

  return sendEmail(user.email, subject, text, html);
};

// Function to send deadline reminder notification
const sendDeadlineReminderNotification = async (user, task, project) => {
  const subject = `Deadline Reminder: ${task.title}`;
  const text = `Hello ${user.name},\n\nThis is a reminder that the task "${task.title}" in the project "${project.name}" is due tomorrow. Please ensure it's completed on time.\n\nBest regards,\nYour Project Management Team`;
  const html = `<p>Hello ${user.name},</p><p>This is a reminder that the task "${task.title}" in the project "${project.name}" is due tomorrow. Please ensure it's completed on time.</p><p>Best regards,<br>Your Project Management Team</p>`;

  return sendEmail(user.email, subject, text, html);
};

export default {
  sendProjectAssignmentNotification,
  sendTaskAssignmentNotification,
  sendDeadlineReminderNotification,
};
