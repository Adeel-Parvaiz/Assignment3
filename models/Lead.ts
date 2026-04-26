import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email?: string;
  phone?: string;
  propertyInterest?: string;
  budget: number;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  score: number;
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;
  followUpDate?: Date;
  source: 'Facebook' | 'Walk-in' | 'Website' | 'Other';
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    propertyInterest: {
      type: String,
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Closed'],
      default: 'New',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
    },
    score: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    followUpDate: {
      type: Date,
    },
    source: {
      type: String,
      enum: ['Facebook', 'Walk-in', 'Website', 'Other'],
      default: 'Other',
    },
  },
  { timestamps: true }
);

// calculate priority and score based on budget before saving
LeadSchema.pre('save', async function () {
  if (this.isModified('budget') || this.isNew) {
    if (this.budget > 20_000_000) {
      this.priority = 'High';
      this.score    = 100;
    } else if (this.budget >= 10_000_000) {
      this.priority = 'Medium';
      this.score    = 60;
    } else {
      this.priority = 'Low';
      this.score    = 30;
    }
  }
});

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);