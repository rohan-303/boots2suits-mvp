import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'veteran' | 'employer';
  authProvider: 'local' | 'google' | 'linkedin';
  providerId?: string;
  companyId?: mongoose.Types.ObjectId;
  companyName?: string;
  militaryBranch?: string;
  persona?: {
    role?: string;
    yearsOfService?: string;
    skills?: string[];
    goals?: string;
    bio?: string;
    mosCode?: string;
    securityClearance?: string;
    currentLocation?: {
      city: string;
      state: string;
    };
  };
  companyProfile?: {
    website?: string;
    description?: string;
    industry?: string;
    location?: string;
    size?: string;
    logo?: string;
  };
  termsAccepted: boolean;
  termsAcceptedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
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
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  companyName: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'employer';
    },
  },
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
    mosCode: String,
    securityClearance: String,
    currentLocation: {
      city: String,
      state: String
    }
  },
  companyProfile: {
    website: String,
    description: String,
    industry: String,
    location: String,
    size: String,
    logo: String,
  },
  termsAccepted: {
    type: Boolean,
    required: [true, 'You must accept the terms and conditions'],
    default: false,
  },
  termsAcceptedAt: {
    type: Date,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);
