import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  lead: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  action: string;
  details?: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Action type: "Lead Created", "Status Updated", "Lead Assigned", etc.
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);