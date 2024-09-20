import { Router } from "express";
const router = Router();

import {
	getAllTeamMembers,
	getTeamMember,
	createTeamMember,
	updateTeamMember,
	deleteTeamMember,
} from "../controllers/teamMemberController.js";

// /api/team
router.route("/").get(getAllTeamMembers).post(createTeamMember);

// /api/team/:teamMemberId
router
	.route("/:teamMemberId")
	.get(getTeamMember)
	.put(updateTeamMember)
	.delete(deleteTeamMember);


export default router;