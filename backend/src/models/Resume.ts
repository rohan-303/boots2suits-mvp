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

export interface IEducation {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  graduationYear?: string;
}

export interface IResume extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  militaryHistory: IMilitaryHistory;
  education?: IEducation[];
  generatedSummary: string;
  generatedSkills: string[];
  generatedExperience: string[];
  fileUrl?: string; // URL to the uploaded/generated PDF
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
  education: [{
    school: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String },
    graduationYear: { type: String }
  }],
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
  fileUrl: {
    type: String
  }
}, {
  timestamps: true
});

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
