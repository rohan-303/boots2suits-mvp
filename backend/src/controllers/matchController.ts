import { Request, Response } from 'express';
import Job from '../models/Job';
import User from '../models/User';

// Helper to calculate score
const calculateScore = (job: any, user: any) => {
  let score = 0;
  
  // 1. MOS Match (30 points)
  // Check if user's MOS code matches any of the job's preferred MOS codes
  if (user.persona?.mosCode && job.veteranPreferences?.mosCodes?.length > 0) {
    const userMos = user.persona.mosCode.toLowerCase();
    const jobMosList = job.veteranPreferences.mosCodes.map((m: string) => m.toLowerCase());
    
    // Direct match
    if (jobMosList.includes(userMos)) {
      score += 30;
    } else {
        // Check for partial match (e.g. 11B matches 11B10) - simplified
        const isPartial = jobMosList.some((m: string) => userMos.startsWith(m) || m.startsWith(userMos));
        if (isPartial) score += 15;
    }
  }

  // 2. Security Clearance (20 points)
  const clearances = ['None', 'Confidential', 'Secret', 'Top Secret', 'Top Secret/SCI'];
  const userClearance = user.persona?.securityClearance || 'None';
  const jobClearance = job.veteranPreferences?.securityClearance || 'None';
  
  const userLevel = clearances.findIndex(c => c.toLowerCase() === userClearance.toLowerCase());
  const jobLevel = clearances.findIndex(c => c.toLowerCase() === jobClearance.toLowerCase());
  
  // If user has equal or higher clearance, full points
  // If job requires none, full points (or maybe 0 if we want to prioritize clearance jobs? Let's give 20 if requirement is met)
  if (userLevel >= jobLevel && userLevel !== -1) {
    score += 20;
  }

  // 3. Skills Match (40 points)
  if (user.persona?.skills?.length > 0 && job.keySkills?.length > 0) {
    const userSkills = user.persona.skills.map((s: string) => s.toLowerCase());
    const jobSkills = job.keySkills.map((s: string) => s.toLowerCase());
    
    // Calculate intersection
    const intersection = jobSkills.filter((s: string) => userSkills.includes(s));
    
    // Calculate percentage of job requirements met
    if (jobSkills.length > 0) {
        const matchRatio = intersection.length / jobSkills.length;
        score += Math.round(matchRatio * 40);
    }
  }

  // 4. Location Match (10 points)
  if (user.persona?.currentLocation?.city && job.city) {
      if (user.persona.currentLocation.city.toLowerCase() === job.city.toLowerCase()) {
          score += 10;
      }
  }
  
  // Bonus: State match (5 points) if city didn't match
  if (user.persona?.currentLocation?.state && job.state) {
       if (user.persona.currentLocation.state.toLowerCase() === job.state.toLowerCase() && 
           user.persona.currentLocation.city?.toLowerCase() !== job.city?.toLowerCase()) {
           score += 5;
       }
  }

  return Math.min(score, 100);
};

// @desc    Get matched jobs for the current user
// @route   GET /api/jobs/matches
// @access  Private (Veteran only)
export const getJobMatches = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const user = await User.findById(userId);
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.role !== 'veteran') {
       // Employers don't get job matches in this context
       res.status(403);
       throw new Error('Only veterans can access job matching');
    }

    // Get all active jobs
    // In production, we would filter this query for efficiency (e.g. location, etc.)
    // For MVP, fetch all and filter in memory
    const jobs = await Job.find({ isActive: true })
        .populate('postedBy', 'companyName companyProfile');

    // Calculate scores
    const matchedJobs = jobs.map(job => {
      const score = calculateScore(job, user);
      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salaryRange: job.salaryRange,
        postedAt: job.createdAt,
        score: score,
        matchDetails: {
            mosMatch: (user.persona?.mosCode && job.veteranPreferences?.mosCodes?.includes(user.persona.mosCode)),
            skillMatchCount: 0 // Placeholder, could calculate real count
        }
      };
    })
    .filter(match => match.score > 0) // Only return matches with > 0 score
    .sort((a, b) => b.score - a.score); // Sort by score descending

    res.status(200).json(matchedJobs);

  } catch (error: any) {
    console.error('Error in getJobMatches:', error);
    res.status(500).json({ message: error.message });
  }
};
