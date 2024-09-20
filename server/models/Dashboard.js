import { Schema, model } from 'mongoose';

const DashboardSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  recentActivities: [{
    activityType: {
      type: String,
      enum: ['created', 'updated', 'deleted'],
      required: true
    },
    entityType: {
      type: String,
      enum: ['project', 'budget', 'task'],
      required: true
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  statistics: {
    totalProjects: {
      type: Number,
      default: 0
    },
    completedProjects: {
      type: Number,
      default: 0
    },
    totalBudget: {
      type: Number,
      default: 0
    },
    allocatedBudget: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

DashboardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default model('Dashboard', DashboardSchema);
