import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  status: 'applied' | 'reviewing' | 'interviewing' | 'rejected' | 'accepted';
  appliedAt: Date;
}

const ApplicationSchema = new Schema({
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'reviewing', 'interviewing', 'rejected', 'accepted'],
    default: 'applied'
  }
}, {
  timestamps: { createdAt: 'appliedAt', updatedAt: true }
});

// Prevent duplicate applications
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
