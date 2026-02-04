import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { createStory, getStories } from '../controllers/storyController';

const router = express.Router();

router.route('/')
  .post(protect, createStory)
  .get(getStories);

export default router;
