import express from 'express';
import { updateProfile, getCandidates, saveCandidate, unsaveCandidate, getSavedCandidates } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.get('/candidates', protect, getCandidates);
router.post('/saved-candidates', protect, saveCandidate);
router.delete('/saved-candidates/:candidateId', protect, unsaveCandidate);
router.get('/saved-candidates', protect, getSavedCandidates);

export default router;
