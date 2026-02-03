import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'veteran' | 'employer';
  authProvider: 'local' | 'google' | 'linkedin';
  providerId?: string;
  companyName?: string;
  companyDescription?: string;
  companyWebsite?: string;
  companyLocation?: string;
  companyIndustry?: string;
  companySize?: string;
  militaryBranch?: string;
  persona?: {
    role?: string;
    yearsOfService?: string;
    skills?: string[];
    goals?: string;
    bio?: string;
  };
  savedCandidates: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: function(this: IUser) {
      return this.authProvider === 'local';
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['veteran', 'employer', 'admin'],
    required: true,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'linkedin'],
    default: 'local',
  },
  providerId: {
    type: String,
  },
  companyName: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'employer';
    },
  },
  companyDescription: String,
  companyWebsite: String,
  companyLocation: String,
  companyIndustry: String,
  companySize: String,
  militaryBranch: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'veteran';
    },
  },
  persona: {
    role: String,
    yearsOfService: String,
    skills: [String],
    goals: String,
    bio: String,
  },
  savedCandidates: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);
