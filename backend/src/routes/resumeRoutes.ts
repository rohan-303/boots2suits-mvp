import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { createResume, getMyResume, updateResume, parseResume } from '../controllers/resumeController';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createResume);
router.post('/parse', upload.single('file'), parseResume);
router.get('/me', getMyResume);
router.put('/:resumeId', updateResume);

export default router;
