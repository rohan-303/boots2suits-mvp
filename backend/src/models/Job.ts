import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Internship';
  workplaceType: 'On-site' | 'Hybrid' | 'Remote';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Director' | 'Executive';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    period: 'Hourly' | 'Monthly' | 'Yearly';
  };
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  clearanceLevel?: 'None' | 'Public Trust' | 'Secret' | 'Top Secret' | 'Top Secret/SCI';
  applicationDeadline?: Date;
  postedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const JobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'],
    default: 'Full-time',
  },
  workplaceType: {
    type: String,
    enum: ['On-site', 'Hybrid', 'Remote'],
    default: 'On-site',
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Director', 'Executive'],
    default: 'Mid',
  },
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD',
    },
    period: {
      type: String,
      enum: ['Hourly', 'Monthly', 'Yearly'],
      default: 'Yearly',
    }
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
  },
  requirements: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  benefits: {
    type: [String],
    default: [],
  },
  clearanceLevel: {
    type: String,
    enum: ['None', 'Public Trust', 'Secret', 'Top Secret', 'Top Secret/SCI'],
    default: 'None',
  },
  applicationDeadline: {
    type: Date,
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IJob>('Job', JobSchema);
