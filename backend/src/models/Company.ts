import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  website?: string;
  industry?: string;
  description?: string;
  location?: string;
  size?: string; // e.g., '1-10', '11-50'
  logo?: string;
  policies?: {
    privacyPolicy?: string;
    termsAccepted?: boolean;
    termsAcceptedAt?: Date;
  };
  adminId: mongoose.Types.ObjectId; // The user who created/manages this profile
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  industry: String,
  description: String,
  location: String,
  size: String,
  logo: String,
  policies: {
    privacyPolicy: String,
    termsAccepted: { type: Boolean, default: false },
    termsAcceptedAt: Date
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ICompany>('Company', CompanySchema);
