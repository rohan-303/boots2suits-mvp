import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  industry: string;
  website?: string;
  description?: string;
  location?: string; // Headquarters
  size?: string; // e.g., "1-10", "11-50"
  logo?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Please add a company name'],
      unique: true,
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Please add an industry'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with http or https',
      ],
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    },
    logo: {
      type: String, // URL to image
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
CompanySchema.index({ name: 'text', description: 'text', industry: 'text' });

export default mongoose.model<ICompany>('Company', CompanySchema);
