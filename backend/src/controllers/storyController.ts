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
      status: 'pending'
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
    const { status } = req.query;
    const filter = status ? { status } : { status: 'approved' };
    
    const stories = await Story.find(filter)
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update story status
// @route   PUT /api/stories/:id/status
// @access  Private (Admin only)
export const updateStoryStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const story = await Story.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!story) {
      res.status(404).json({ message: 'Story not found' });
      return;
    }

    res.json(story);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
