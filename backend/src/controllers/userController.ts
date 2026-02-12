import { Request, Response } from 'express';
import User from '../models/User';
import { Resume } from '../models/Resume';
import SavedCandidate from '../models/SavedCandidate';

export const getCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      search, 
      education, 
      securityClearance, 
      militaryBranch, 
      mosCode,
      location 
    } = req.query;

    const query: any = { role: 'veteran' };

    // 1. Filter by User fields (persona)
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { 'persona.role': searchRegex },
        { 'persona.mosCode': searchRegex }
      ];
    }

    if (securityClearance && securityClearance !== 'None') {
      // Assuming hierarchical clearance is handled or simple exact match
      // For MVP, exact match or check existence
      if (securityClearance === 'Any') {
        query['persona.securityClearance'] = { $exists: true, $ne: 'None' };
      } else {
        query['persona.securityClearance'] = securityClearance;
      }
    }

    if (militaryBranch && militaryBranch !== 'Any') {
      query.militaryBranch = militaryBranch;
    }

    if (mosCode) {
      query['persona.mosCode'] = new RegExp(mosCode as string, 'i');
    }

    if (location) {
      query['persona.currentLocation.state'] = new RegExp(location as string, 'i');
    }

    // 2. Execute Query
    let veterans = await User.find(query).select('-password');

    // 3. Populate Resume Data and Filter by Education/Skills if needed
    // Note: Filtering by resume fields (skills, education) is harder after fetching Users.
    // For MVP, we will fetch resumes for matched users and then filter in memory if necessary.
    // Ideally, we should denormalize critical search fields to User model.
    
    const candidates = await Promise.all(veterans.map(async (veteran) => {
      const resume = await Resume.findOne({ user: veteran._id }).sort({ createdAt: -1 });
      
      // Filter by education if provided (in memory)
      if (education) {
        const eduLevel = education as string;
        // Simple check if resume education contains the level
        const hasEducation = resume?.education?.some(edu => edu.degree.includes(eduLevel));
        if (!hasEducation) return null;
      }

      return {
        _id: veteran._id,
        firstName: veteran.firstName,
        lastName: veteran.lastName,
        email: veteran.email,
        militaryBranch: veteran.militaryBranch,
        location: veteran.persona?.currentLocation 
          ? `${veteran.persona.currentLocation.city}, ${veteran.persona.currentLocation.state}` 
          : 'USA',
        role: veteran.persona?.role || 'Veteran',
        matchScore: 85, // Placeholder - implement scoring logic if needed
        resume: resume ? {
          _id: resume._id,
          title: resume.title,
          summary: resume.generatedSummary,
          skills: resume.generatedSkills,
          experience: resume.generatedExperience,
          militaryHistory: resume.militaryHistory,
          fileUrl: resume.fileUrl // Ensure this exists in Resume model
        } : null,
        persona: veteran.persona
      };
    }));

    // Filter out nulls (from education filter)
    const finalCandidates = candidates.filter(c => c !== null);

    res.status(200).json(finalCandidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCandidateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Candidate not found' });
      return;
    }

    const resume = await Resume.findOne({ user: user._id }).sort({ createdAt: -1 });

    const candidate = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        militaryBranch: user.militaryBranch,
        location: user.persona?.currentLocation 
          ? `${user.persona.currentLocation.city}, ${user.persona.currentLocation.state}` 
          : 'USA',
        role: user.persona?.role || 'Veteran',
        matchScore: 100,
        resume: resume ? {
          _id: resume._id,
          title: resume.title,
          summary: resume.generatedSummary,
          skills: resume.generatedSkills,
          experience: resume.generatedExperience,
          militaryHistory: resume.militaryHistory,
          education: resume.education,
          fileUrl: resume.fileUrl
        } : null,
        persona: user.persona
    };

    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const saveCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { candidateId, jobId, notes } = req.body;
    const employerId = (req as any).user?._id;

    if (!candidateId) {
      res.status(400).json({ message: 'Candidate ID is required' });
      return;
    }

    const existingSave = await SavedCandidate.findOne({
      employer: employerId,
      candidate: candidateId,
      job: jobId || null
    });

    if (existingSave) {
      res.status(400).json({ message: 'Candidate already saved for this job' });
      return;
    }

    const savedCandidate = await SavedCandidate.create({
      employer: employerId,
      candidate: candidateId,
      job: jobId || null,
      notes
    });

    res.status(201).json(savedCandidate);
  } catch (error) {
    console.error('Error saving candidate:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getSavedCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const employerId = (req as any).user?._id;
    const saved = await SavedCandidate.find({ employer: employerId })
      .populate('candidate', 'firstName lastName email militaryBranch persona')
      .populate('job', 'title location');
      
    res.status(200).json(saved);
  } catch (error) {
    console.error('Error fetching saved candidates:', error);
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
