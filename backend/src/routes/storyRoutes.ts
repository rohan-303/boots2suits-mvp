import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { createStory, getStories, updateStoryStatus } from '../controllers/storyController';

const router = express.Router();

router.route('/')
  .post(protect, createStory)
  .get(getStories);

router.put('/:id/status', protect, updateStoryStatus);

export default router;
