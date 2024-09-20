// Import team member model
import TeamMember from "../models/TeamMember.js";
import User from "../models/User.js";

// Get all team members
export async function getAllTeamMembers(req, res) {
    try {
        const allTeamMembers = await TeamMember.find({});

        if (!allTeamMembers || allTeamMembers.length === 0) {
            return res.status(404).json({ message: "No team members found." });
        }

        res.status(200).json(allTeamMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
}

// Get a team member by their id
export async function getTeamMember(req, res) {
    try {
        const teamMember = await TeamMember.findById(req.params.teamMemberId);

        if (!teamMember) {
            return res.status(404).json({ message: "No team member found with that id." });
        }

        res.status(200).json(teamMember);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
}

// Create team member
export async function createTeamMember(req, res) {
    try {
        const newTeamMember = new TeamMember(req.body);
        const savedTeamMember = await newTeamMember.save();

        // Add team member to the team of the person creating this user (manager)
        const manager = await User.findByIdAndUpdate(
            req.body.manager,
            { $addToSet: { teamMembers: savedTeamMember._id } },
            { new: true }
        );

        if (!manager) {
            return res.status(400).json({ message: "Team member added but not linked to manager." });
        }

        res.status(201).json(savedTeamMember);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
}

// Update team member
export async function updateTeamMember(req, res) {
    try {
        const teamMember = await TeamMember.findByIdAndUpdate(
            req.params.teamMemberId,
            req.body,
            { runValidators: true, new: true }
        );

        if (!teamMember) {
            return res.status(404).json({ message: "Unable to update team member." });
        }

        res.status(200).json(teamMember);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
}

// Delete team member
export async function deleteTeamMember(req, res) {
    try {
        const teamMember = await TeamMember.findByIdAndDelete(req.params.teamMemberId);

        if (!teamMember) {
            return res.status(404).json({ message: "Unable to delete team member." });
        }

        res.status(200).json({ message: "Team member deleted." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
}
