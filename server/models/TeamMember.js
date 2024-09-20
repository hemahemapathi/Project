import mongoose from "mongoose";
import { Schema } from "mongoose";

// Schema to create TeamMember model
const TeamMemberSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		role: {
			type: String,
			required: true,
		},
		efficiency: {
			type: Number,
			required: true,
		},
		hoursPerWeek: {
			type: Number,
			required: true,
		},
		manager: [{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	},
	// Allow use of virtuals below
	{
		toJSON: {
			virtuals: true,
		},
	}
);

// Initialise TeamMember model
const TeamMember = mongoose.model('TeamMember', TeamMemberSchema);

export default TeamMember;