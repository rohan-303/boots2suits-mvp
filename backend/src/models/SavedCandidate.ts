import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedCandidate extends Document {
  employer: mongoose.Types.ObjectId;
  candidate: mongoose.Types.ObjectId;
  job?: mongoose.Types.ObjectId; // Optional link to a specific job
  notes?: string;
  createdAt: Date;
}

const SavedCandidateSchema: Schema = new Schema({
  employer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  candidate: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  job: { 
    type: Schema.Types.ObjectId, 
    ref: 'Job' 
  },
  notes: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Prevent duplicate saves for the same candidate-job pair by the same employer
SavedCandidateSchema.index({ employer: 1, candidate: 1, job: 1 }, { unique: true });

export default mongoose.model<ISavedCandidate>('SavedCandidate', SavedCandidateSchema);
