import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { sendMessage, getConversations, getMessages, markAsRead, getUnreadCount } from '../controllers/messageController';

const router = express.Router();

router.use(protect); // All message routes require authentication

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/unread', getUnreadCount);
router.get('/:otherUserId', getMessages);
router.put('/read/:senderId', markAsRead);

export default router;
