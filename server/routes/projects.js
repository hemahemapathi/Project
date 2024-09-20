import express from "express";
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


import { getAllProjects, getProject, createProject, updateProject, deleteProject, getAllFeatures, getFeature, createFeature, updateFeature, deleteFeature,createTask, deleteTask, getAllTasks, getTask, updateTask, addAttachment } from "../controllers/projectController.js";
import { authMiddleware } from "./auth.js";


// /api/projects
router.route("/").get(getAllProjects).post(createProject);

// /api/projects/:projectId
router
	.route("/:projectId")
	.get(getProject)
	.put(updateProject)
	.delete(deleteProject);

// /api/projects/:projectId/features
router.route("/:projectId/features").get(getAllFeatures).post(createFeature);

// /api/projects/:projectId/features/:featureId
router
	.route("/:projectId/features/:featureId")
	.get(getFeature)
	.put(updateFeature)
	.delete(deleteFeature);

// /api/projects/:projectId/features/:featureId/tasks
router
	.route("/:projectId/features/:featureId/tasks")
	.get(getAllTasks)
	.post(createTask);

// /api/projects/:projectId/features/:featureId/tasks/:taskId
router
	.route("/:projectId/features/:featureId/tasks/:taskId")
	.get(getTask)
	.put(updateTask)
	.delete(deleteTask);
// /api/projects/:projectId/features/:featureId/tasks/:taskId/attachments
router.post('/:projectId/features/:featureId/tasks/:taskId/attachments', authMiddleware, upload.single('file'), addAttachment);

export default router;