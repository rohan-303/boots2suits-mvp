import mongoose, { Document, Schema } from 'mongoose';

export interface IStory extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  militaryBranch: string;
  currentRole: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const StorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  content: {
    type: String,
    required: [true, 'Please add your story content']
  },
  militaryBranch: {
    type: String,
    required: [true, 'Please specify your military branch']
  },
  currentRole: {
    type: String,
    required: [true, 'Please specify your current role']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved' // Auto-approve for MVP
  }
}, {
  timestamps: true
});

export default mongoose.model<IStory>('Story', StorySchema);
