import { Request, Response } from 'express';
import User from '../models/User';
import { Resume } from '../models/Resume';

export const getCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Find all users with role 'veteran'
    const veterans = await User.find({ role: 'veteran' }).select('-password');

    // 2. For each veteran, attach their latest resume (for skills, summary, etc.)
    const candidates = await Promise.all(veterans.map(async (veteran) => {
      const resume = await Resume.findOne({ user: veteran._id }).sort({ createdAt: -1 });
      
      return {
        _id: veteran._id,
        firstName: veteran.firstName,
        lastName: veteran.lastName,
        email: veteran.email,
        militaryBranch: veteran.militaryBranch,
        location: 'USA', // Placeholder as location isn't in User model yet
        resume: resume ? {
          title: resume.title,
          summary: resume.generatedSummary,
          skills: resume.generatedSkills,
          experience: resume.generatedExperience,
          militaryHistory: resume.militaryHistory
        } : null
      };
    }));

    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { persona, companyProfile } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    const updateData: any = {};
    if (persona) updateData.persona = persona;
    if (companyProfile) updateData.companyProfile = companyProfile;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $set: updateData
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('firstName lastName image role');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
