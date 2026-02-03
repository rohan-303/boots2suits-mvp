import mongoose, { Document, Schema } from 'mongoose';

export interface IPartnerInquiry extends Document {
  organizationName: string;
  contactName: string;
  email: string;
  type: 'education' | 'government' | 'corporate' | 'other';
  message: string;
  status: 'new' | 'contacted' | 'partnered' | 'rejected';
  createdAt: Date;
}

const PartnerInquirySchema: Schema = new Schema({
  organizationName: { type: String, required: true },
  contactName: { type: String, required: true },
  email: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['education', 'government', 'corporate', 'other'],
    required: true 
  },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'partnered', 'rejected'],
    default: 'new'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPartnerInquiry>('PartnerInquiry', PartnerInquirySchema);
