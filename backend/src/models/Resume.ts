import mongoose, { Document, Schema } from 'mongoose';

export interface IMilitaryHistory {
  branch: string;
  rank: string;
  mosCode: string; // Military Occupational Specialty code
  yearsOfService: number;
  securityClearance?: string;
  leadershipRole?: string;
  awards?: string;
  description?: string;
}

export interface IResume extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  militaryHistory: IMilitaryHistory;
  generatedSummary: string;
  generatedSkills: string[];
  generatedExperience: string[];
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'My Resume'
  },
  militaryHistory: {
    branch: { type: String, required: true },
    rank: { type: String, required: true },
    mosCode: { type: String, required: true },
    yearsOfService: { type: Number, required: true },
    securityClearance: { type: String, default: 'None' },
    leadershipRole: { type: String },
    awards: { type: String },
    description: { type: String }
  },
  generatedSummary: {
    type: String,
    default: ''
  },
  generatedSkills: [{
    type: String
  }],
  generatedExperience: [{
    type: String
  }],
}, {
  timestamps: true
});

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
