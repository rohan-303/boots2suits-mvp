import { Request, Response } from 'express';
import Story from '../models/Story';

// @desc    Create a new success story
// @route   POST /api/stories
// @access  Private (Veteran only)
export const createStory = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { title, content, militaryBranch, currentRole } = req.body;

    if (user.role !== 'veteran') {
      res.status(403);
      throw new Error('Only veterans can share stories');
    }

    const story = await Story.create({
      user: user._id,
      title,
      content,
      militaryBranch,
      currentRole,
      status: 'approved' // Auto-approve for MVP
    });

    res.status(201).json(story);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all approved success stories
// @route   GET /api/stories
// @access  Public
export const getStories = async (req: Request, res: Response) => {
  try {
    const stories = await Story.find({ status: 'approved' })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
