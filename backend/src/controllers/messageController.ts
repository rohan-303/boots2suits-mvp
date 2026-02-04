import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import User from '../models/User';
import mongoose from 'mongoose';

// Send a message
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = (req as any).user.id;

    if (!recipientId || !content) {
      res.status(400);
      throw new Error('Recipient and content are required');
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res.status(404);
      throw new Error('Recipient not found');
    }

    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content
    });

    const populatedMessage = await message.populate('sender', 'firstName lastName image');

    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

// Get all conversations for the current user (Inbox)
export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    // Aggregate to find unique conversation partners and the latest message
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { recipient: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      {
        $unwind: '$otherUser'
      },
      {
        $project: {
          _id: 0,
          user: {
            _id: '$otherUser._id',
            firstName: '$otherUser.firstName',
            lastName: '$otherUser.lastName',
            role: '$otherUser.role',
            image: '$otherUser.image'
          },
          lastMessage: {
            content: '$lastMessage.content',
            createdAt: '$lastMessage.createdAt',
            read: '$lastMessage.read',
            sender: '$lastMessage.sender'
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

// Get messages between current user and another user
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'firstName lastName image');

    // Mark received messages as read
    await Message.updateMany(
      { sender: otherUserId, recipient: userId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// Mark messages as read (Explicit)
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { senderId } = req.params;

    await Message.updateMany(
      {
        sender: senderId,
        recipient: userId,
        read: false
      },
      {
        $set: { read: true }
      }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    next(error);
  }
};

// Get global unread message count
export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const count = await Message.countDocuments({
      recipient: userId,
      read: false
    });
    res.json({ count });
  } catch (error) {
    next(error);
  }
};
