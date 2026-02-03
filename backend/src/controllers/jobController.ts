import { Request, Response } from 'express';
import Job from '../models/Job';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer only)
export const createJob = async (req: Request, res: Response) => {
  try {
    console.log('createJob controller hit');
    const { title, company, location, type, salaryRange, description, requirements } = req.body;
    console.log('Request body:', req.body);
    
    // Get user from request (attached by auth middleware)
    // Using (req as any).user because of Express type extension issues
    const user = (req as any).user;
    console.log('User from request:', user);

    if (!user) {
      console.log('User not found in request');
      res.status(401);
      throw new Error('User not authorized');
    }

    if (user.role !== 'employer') {
      console.log(`User role mismatch: ${user.role}`);
      res.status(403);
      throw new Error('Only employers can post jobs');
    }

    const jobData = {
      title,
      company,
      location,
      type,
      salaryRange,
      description,
      requirements,
      postedBy: user._id,
    };
    console.log('Creating job with data:', jobData);

    const job = await Job.create(jobData);
    console.log('Job created successfully:', job);

    res.status(201).json(job);
  } catch (error: any) {
    console.error('Error creating job:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public (or Private based on requirements)
export const getJobs = async (req: Request, res: Response) => {
  try {
    console.log('getJobs controller hit');
    // Optional: Filtering logic can be added here
    const jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email company'); // Populate employer details
    
    console.log(`Found ${jobs.length} jobs`);
    res.status(200).json(jobs);
  } catch (error: any) {
    console.error('Error in getJobs:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email company');

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    res.status(200).json(job);
  } catch (error: any) {
    res.status(404).json({ message: 'Job not found' });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    const user = (req as any).user;

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Check if user is the job owner
    if (job.postedBy.toString() !== user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this job');
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return new document and run validators
    );

    res.status(200).json(updatedJob);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only)
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    const user = (req as any).user;

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Check if user is the job owner
    if (job.postedBy.toString() !== user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this job');
    }

    await job.deleteOne();

    res.status(200).json({ message: 'Job removed' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get jobs posted by current employer
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer only)
export const getMyJobs = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (user.role !== 'employer') {
        res.status(403);
        throw new Error('Access denied');
    }

    const jobs = await Job.find({ postedBy: user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
