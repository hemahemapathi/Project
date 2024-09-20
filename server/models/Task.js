import mongoose from "mongoose";
import { Schema } from "mongoose";

// Helper function to format date
import dateFormat from "../utils/dateFormat.js";

// Schema to create the task field's subdocument schema in the Feature model
const TaskSchema = new mongoose.Schema(
	{
		taskName: {
			type: String,
			required: "Your task needs a name.",
			trim: true,
		},
		taskAcceptanceCriteria: {
			type: String,
			required: "Your task needs acceptance criteria.",
			minlength: 1,
			maxlength: 280,
			trim: true,
		},
		taskCreatedAt: {
			type: Date,
			default: Date.now,
			get: (timestamp) => dateFormat(timestamp),
		},
		taskFinishedAt: {
			type: Date,
			get: (timestamp) => dateFormat(timestamp),
		},
		taskTimeEstimate: {
			type: Number,
			required: true,
		},
		taskTimeActual: {
			type: Number,
		},
		taskPdfFiles: [{
			type: String,
			trim: true,
		}],
	},
	// Allow use of virtuals below
	{
		toJSON: {
			virtuals: true,
		},
	}
);

// Create a virtual property "taskEfficiency" that compares time task took compared to task
TaskSchema.virtual("taskEfficiency").get(function () {
	return this.taskTimeActual / this.taskTimeEstimate;
});

export default mongoose.model('Task', TaskSchema);