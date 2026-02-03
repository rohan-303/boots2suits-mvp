import { Request, Response } from 'express';
import Application from '../models/Application';
import Job from '../models/Job';
import { Resume } from '../models/Resume';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Veteran only)
export const applyForJob = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const jobId = req.params.jobId;

    if (user.role !== 'veteran') {
      res.status(403);
      throw new Error('Only veterans can apply for jobs');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: user._id
    });

    if (existingApplication) {
      res.status(400);
      throw new Error('You have already applied for this job');
    }

    const application = await Application.create({
      job: jobId,
      applicant: user._id
    });

    res.status(201).json(application);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only - owner of job)
export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Ensure the requester owns the job
    if (job.postedBy.toString() !== user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view applications for this job');
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'firstName lastName email militaryBranch persona')
      .sort({ appliedAt: -1 });

    // Manually attach resume to each application
    const applicationsWithResume = await Promise.all(applications.map(async (app: any) => {
      const resume = await Resume.findOne({ user: app.applicant._id }).sort({ createdAt: -1 });
      return {
        ...app.toObject(),
        resume: resume ? {
          title: resume.title,
          summary: resume.generatedSummary,
          skills: resume.generatedSkills,
          experience: resume.generatedExperience,
          militaryHistory: resume.militaryHistory
        } : null
      };
    }));

    res.status(200).json(applicationsWithResume);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my applications
// @route   GET /api/applications/my
// @access  Private (Veteran only)
export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const applications = await Application.find({ applicant: user._id })
      .populate('job', 'title company location type')
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
