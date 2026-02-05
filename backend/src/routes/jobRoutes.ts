import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  parseJobDescription,
} from '../controllers/jobController';
import { getJobMatches } from '../controllers/matchController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes (or semi-public)
router.get('/', getJobs);

// Protected routes
router.get('/matches', protect, getJobMatches);
router.post('/', protect, createJob);
router.post('/parse-jd', protect, upload.single('file'), parseJobDescription);
router.get('/my-jobs', protect, getMyJobs); // Specific route should come before :id to avoid conflict if id matches 'my-jobs' (unlikely but good practice)
router.get('/:id', getJobById); // This can be public
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

export default router;
