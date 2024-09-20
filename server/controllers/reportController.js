import asyncHandler from 'express-async-handler';
import Report from '../models/Report.js';
import * as reportGenerator from '../services/reportGenerator.js';

export const generateReport = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { type } = req.body;

  let reportData;
  switch (type) {
    case 'project':
      reportData = await reportGenerator.generateProjectReport(projectId);
      break;
    case 'task':
      reportData = await reportGenerator.generateTaskReport(projectId);
      break;
    case 'workload':
      reportData = await reportGenerator.generateWorkloadReport(projectId);
      break;
    default:
      throw new Error('Invalid report type');
  }

  const report = new Report({
    project: projectId,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
    type,
    data: reportData,
    createdBy: req.user._id
  });

  const savedReport = await report.save();
  res.status(201).json(savedReport);
});

export const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ project: req.params.projectId })
    .populate('project', 'name')
    .populate('createdBy', 'name email');
  res.json(reports);
});

export const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate('project', 'name')
    .populate('createdBy', 'name email');
  if (report) {
    res.json(report);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

export const downloadReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (report) {
    res.json(report.data);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});
