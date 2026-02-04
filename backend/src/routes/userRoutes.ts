import express from 'express';
import { updateProfile, getCandidates, getUserById } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.get('/candidates', protect, getCandidates);
router.get('/:id', protect, getUserById);

export default router;
