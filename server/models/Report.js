import { Schema, model } from 'mongoose';

const ReportSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['project', 'task', 'workload', 'basic'],
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

ReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default model('Report', ReportSchema);
