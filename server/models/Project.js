import mongoose from "mongoose";
import dateFormat from "../utils/dateFormat.js";
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  projectName: {
    type: String,
    required: "Your project name is required",
    unique: true,
    trim: true
  },
  projectDescription: {
    type: String,
    required: "Your project requires description",
    minlength: 1,
    maxlength: 200,
    trim: true
  },
  projectTeamMembers:[ {
    type: Schema.Types.ObjectId,
    ref: "TeamMember"
  },
],
  projectManager:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
],
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
  features: [{
    featureName: {
      type: String,
      required: true
    },
    featureDescription: {
      type: String,
      required: true
    },
    featureAssignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    tasks: [{
      type: Schema.Types.ObjectId,
      ref: "Task"
    }]
  }],
  reports: [{
    type: Schema.Types.ObjectId,
    ref: "Report"
  }],
  budget: {
    type: Schema.Types.ObjectId,
    ref: "Budget"
  },
  dashboard: {
    type: Schema.Types.ObjectId,
    ref: "Dashboard"
  }
},
{
    toJSON: {
        virtuals: true,
    },
}
);

ProjectSchema.virtual("featureCount").get(function () {
  return this.features ? this.features.length : 0;
});

ProjectSchema.virtual("projectRawTimeEstimate").get(function () {
  if (!this.features) return 0;
  const featureRawTimeEstimateArray = this.features.map(feature => 
    feature.tasks ? feature.tasks.reduce((sum, task) => sum + (task.taskTimeEstimate || 0), 0) : 0
  );
  return featureRawTimeEstimateArray.reduce((total, num) => total + num, 0);
});

ProjectSchema.virtual('completionPercentage').get(function() {
  if (!this.features || this.features.length === 0) return 0;
  const allTasks = this.features.flatMap(feature => feature.tasks || []);
  if (allTasks.length === 0) return 0;
  const completedTasks = allTasks.filter(task => task.status === 'completed');
  return (completedTasks.length / allTasks.length) * 100;
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;