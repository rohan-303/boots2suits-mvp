import express from 'express';
import { register, login, googleAuth, linkedinAuth } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/linkedin', linkedinAuth);

export default router;
