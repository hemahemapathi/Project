import User from "../models/User.js";
import { signToken } from "../routes/auth.js";

export const getUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in getUser:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


export async function signupUser(req, res) {
  try {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error during signup", error: err.message });
  }
}

export async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.isCorrectPassword(password))) {
      return res.status(401).json({ message: "Incorrect credentials." });
    }
    const token = signToken(user);
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during login" });
  }
}

export async function getAllManagersTeamMembers(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const manager = await User.findById(req.user._id).populate("teamMembers");
    if (!manager) {
      return res.status(404).json({ message: "Manager not found." });
    }
    res.json(manager.teamMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving team members" });
  }
}


export async function getAllManagersProjects(req, res) {
  try {
    const manager = await User.findById(req.user._id).populate("projects");
    if (!manager) {
      return res.status(404).json({ message: "Manager not found." });
    }
    res.json(manager.projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving projects" });
  }
};
