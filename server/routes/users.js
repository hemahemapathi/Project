// Using ES modules syntax for consistency
import express from 'express';
import { Router } from "express";
const userRouter = Router();
const router = express.Router();
// Import the necessary controller functions and auth middleware
import {
  getUser,
  signupUser,
  loginUser,
  getAllManagersTeamMembers,
  getAllManagersProjects
} from "../controllers/userController.js";

// Import authorisation middleware to be used for token verification
import { authMiddleware } from "../routes/auth.js";

// Signup route: POST /users (create a new user)
router.post("/signup", signupUser);

// Login route: POST /users/login (login user and return token)
router.post("/login", loginUser);

// Get the current logged-in user: GET /users/me (requires token/auth)
router.get("/me", authMiddleware, getUser);

// Get manager's team members: GET /users/myteam (requires token/auth)
router.get("/myteam", authMiddleware, getAllManagersTeamMembers);

// Get manager's projects: GET /users/myprojects (requires token/auth)
router.get("/myprojects", authMiddleware, getAllManagersProjects);


export default router;
