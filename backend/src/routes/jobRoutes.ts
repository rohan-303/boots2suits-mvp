import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} from '../controllers/jobController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes (or semi-public)
router.get('/', getJobs);

// Protected routes
router.post('/', protect, createJob);
router.get('/my-jobs', protect, getMyJobs); // Specific route should come before :id to avoid conflict if id matches 'my-jobs' (unlikely but good practice)
router.get('/:id', getJobById); // This can be public
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

export default router;
