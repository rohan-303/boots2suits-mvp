import express from 'express';
import { createInquiry, getInquiries, updateInquiryStatus } from '../controllers/partnerController';

const router = express.Router();

// Public route to submit an inquiry
router.post('/', createInquiry);

// Protected route (TODO: Add Auth Middleware for Admin)
router.get('/', getInquiries);
router.put('/:id/status', updateInquiryStatus);

export default router;
