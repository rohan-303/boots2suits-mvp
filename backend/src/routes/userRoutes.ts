import express from 'express';
import { updateProfile, getCandidates, getUserById, saveCandidate, getSavedCandidates, getCandidateById } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.get('/candidates', protect, getCandidates);
router.post('/saved', protect, saveCandidate);
router.get('/saved', protect, getSavedCandidates);
router.get('/candidates/:id', protect, getCandidateById);
router.get('/:id', protect, getUserById);

export default router;
