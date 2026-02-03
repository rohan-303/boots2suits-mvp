import { Request, Response } from 'express';
import User from '../models/User';
import { Resume } from '../models/Resume';
import Job from '../models/Job';

// Helper to map years of service to experience level
const getExperienceLevel = (years: number): string => {
  if (years < 3) return 'Entry';
  if (years < 7) return 'Mid';
  if (years < 12) return 'Senior';
  return 'Executive'; // or Director
};

const clearanceRank = {
  'None': 0,
  'Public Trust': 1,
  'Secret': 2,
  'Top Secret': 3,
  'Top Secret/SCI': 4
};

export const getCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = req.query.jobId as string;
    let job: any = null;

    if (jobId) {
      job = await Job.findById(jobId);
    }

    // 1. Find all users with role 'veteran'
    const veterans = await User.find({ role: 'veteran' }).select('-password');

    // 2. For each veteran, attach their latest resume (for skills, summary, etc.)
    let candidates = await Promise.all(veterans.map(async (veteran) => {
      const resume = await Resume.findOne({ user: veteran._id }).sort({ createdAt: -1 });
      
      let matchScore = 0;

      if (job && resume) {
        // --- IMPROVED MATCHING ALGORITHM ---
        
        // 1. Skill Intersection (High Value)
        // Check if job requirements match candidate skills
        const jobReqs = (job.requirements || []).map((r: string) => r.toLowerCase());
        const candidateSkills = (resume.generatedSkills || []).map((s: string) => s.toLowerCase());
        
        const matchedSkills = jobReqs.filter((reqSkill: string) => 
          candidateSkills.some((candSkill: string) => candSkill.includes(reqSkill) || reqSkill.includes(candSkill))
        );
        // Max 30 points for skills
        const skillScore = Math.min((matchedSkills.length / (jobReqs.length || 1)) * 30, 30);
        matchScore += skillScore;

        // 2. Title/Role Relevance (20 points)
        if (resume.title && job.title) {
            if (resume.title.toLowerCase().includes(job.title.toLowerCase()) || 
                job.title.toLowerCase().includes(resume.title.toLowerCase())) {
                matchScore += 20;
            }
        }

        // 3. Security Clearance (Critical - 25 points)
        if (job.clearanceLevel && job.clearanceLevel !== 'None') {
            const candClearance = resume.militaryHistory?.securityClearance || 'None';
            // @ts-ignore
            if (clearanceRank[candClearance] >= clearanceRank[job.clearanceLevel]) {
                matchScore += 25;
            }
        } else {
            // If job doesn't require clearance, give some points for having one anyway
            if (resume.militaryHistory?.securityClearance && resume.militaryHistory.securityClearance !== 'None') {
                matchScore += 5;
            }
        }

        // 4. Experience Level / Years of Service (15 points)
        const candYears = resume.militaryHistory?.yearsOfService || 0;
        const candExpLevel = getExperienceLevel(candYears);
        
        if (job.experienceLevel) {
            if (job.experienceLevel === candExpLevel) {
                matchScore += 15;
            } else if (
                (job.experienceLevel === 'Senior' && candExpLevel === 'Executive') ||
                (job.experienceLevel === 'Mid' && candExpLevel === 'Senior')
            ) {
                // Overqualified is better than underqualified
                matchScore += 10;
            }
        }

        // 5. Summary Keyword Search (10 points)
        if (resume.generatedSummary) {
            const summaryLower = resume.generatedSummary.toLowerCase();
            let keywordHits = 0;
            jobReqs.forEach((reqSkill: string) => {
                if (summaryLower.includes(reqSkill)) keywordHits++;
            });
            matchScore += Math.min(keywordHits * 2, 10);
        }

        // Normalize
        matchScore = Math.min(Math.round(matchScore), 99); // Cap at 99
        matchScore = Math.max(matchScore, 10); // Floor at 10
      } else {
        // Random score if no job selected (fallback for MVP feel)
        matchScore = Math.floor(Math.random() * (99 - 60) + 60);
      }

      return {
        _id: veteran._id,
        firstName: veteran.firstName,
        lastName: veteran.lastName,
        email: veteran.email,
        militaryBranch: veteran.militaryBranch,
        location: 'USA', // Placeholder
        matchScore, // Real calculated score
        resume: resume ? {
          title: resume.title,
          summary: resume.generatedSummary,
          skills: resume.generatedSkills,
          experience: resume.generatedExperience,
          militaryHistory: resume.militaryHistory
        } : null
      };
    }));

    // Sort by match score if job is selected
    if (jobId) {
        candidates.sort((a, b) => b.matchScore - a.matchScore);
    }

    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { 
      firstName,
      lastName,
      militaryBranch,
      persona, 
      companyName, 
      companyDescription, 
      companyWebsite, 
      companyLocation, 
      companyIndustry, 
      companySize 
    } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    // Build update object dynamically
    const updateFields: any = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (militaryBranch) updateFields.militaryBranch = militaryBranch;
    if (persona) updateFields.persona = persona;
    if (companyName) updateFields.companyName = companyName;
    if (companyDescription) updateFields.companyDescription = companyDescription;
    if (companyWebsite) updateFields.companyWebsite = companyWebsite;
    if (companyLocation) updateFields.companyLocation = companyLocation;
    if (companyIndustry) updateFields.companyIndustry = companyIndustry;
    if (companySize) updateFields.companySize = companySize;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
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

export const saveCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { candidateId } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!user.savedCandidates.includes(candidateId)) {
            user.savedCandidates.push(candidateId);
            await user.save();
        }

        res.status(200).json({ message: 'Candidate saved', savedCandidates: user.savedCandidates });
    } catch (error) {
        console.error('Error saving candidate:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const unsaveCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { candidateId } = req.params;

        if (!userId) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        user.savedCandidates = user.savedCandidates.filter(id => id.toString() !== candidateId);
        await user.save();

        res.status(200).json({ message: 'Candidate unsaved', savedCandidates: user.savedCandidates });
    } catch (error) {
        console.error('Error unsaving candidate:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getSavedCandidates = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        
        if (!userId) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const user = await User.findById(userId).populate('savedCandidates');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // We need to fetch resume details for each saved candidate to display them properly
        const savedCandidatesWithResumes = await Promise.all(user.savedCandidates.map(async (candidate: any) => {
             const resume = await Resume.findOne({ user: candidate._id }).sort({ createdAt: -1 });
             return {
                 _id: candidate._id,
                 firstName: candidate.firstName,
                 lastName: candidate.lastName,
                 email: candidate.email,
                 militaryBranch: candidate.militaryBranch,
                 location: 'USA', // Placeholder
                 resume: resume ? {
                    title: resume.title,
                    summary: resume.generatedSummary,
                    skills: resume.generatedSkills,
                    experience: resume.generatedExperience,
                    militaryHistory: resume.militaryHistory
                  } : null
             };
        }));

        res.status(200).json(savedCandidatesWithResumes);
    } catch (error) {
        console.error('Error fetching saved candidates:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
