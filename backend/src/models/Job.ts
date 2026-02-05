import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  workExperience?: {
    min: number;
    max?: number;
  };
  educationLevel?: string;
  educationField?: string;
  keySkills: string[];
  openings: number;
  workTimings?: {
    startTime: string;
    endTime: string;
  };
  hiringTimeline?: {
    startDate: Date;
    endDate: Date;
  };
  state?: string;
  city?: string;
  country?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  veteranPreferences?: {
    securityClearance?: string;
    militaryBranch?: string;
    mosCodes?: string[];
    rankCategory?: string;
  };
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
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'],
    default: 'Full-time',
  },
  workMode: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site',
  },
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD',
    },
  },
  workExperience: {
    min: { type: Number, default: 0 },
    max: { type: Number },
  },
  educationLevel: String,
  educationField: String,
  keySkills: [String],
  openings: {
    type: Number,
    default: 1,
  },
  workTimings: {
    startTime: String,
    endTime: String,
  },
  hiringTimeline: {
    startDate: Date,
    endDate: Date,
  },
  state: String,
  city: String,
  country: {
    type: String,
    default: 'United States'
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
  },
  responsibilities: {
    type: [String],
    default: [],
  },
  requirements: {
    type: [String],
    default: [],
  },
  veteranPreferences: {
    securityClearance: String,
    militaryBranch: String,
    mosCodes: [String],
    rankCategory: String,
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
