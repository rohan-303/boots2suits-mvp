import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { applyForJob, getJobApplications, getMyApplications } from '../controllers/applicationController';

const router = express.Router();

router.post('/:jobId', protect, applyForJob);
router.get('/job/:jobId', protect, getJobApplications);
router.get('/my', protect, getMyApplications);

export default router;
