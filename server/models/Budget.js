import { Schema, model } from 'mongoose';

const BudgetSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  totalBudget: {
    type: Number,
    required: true
  },
  allocatedBudget: {
    type: Number,
    default: 0
  },
  expenses: [{
    description: String,
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
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

BudgetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default model('Budget', BudgetSchema);
