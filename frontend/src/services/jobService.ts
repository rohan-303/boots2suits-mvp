import api from './api';
import type { Job, CreateJobData } from '../types/Job';

export const jobService = {
  // Get all jobs (public/protected based on backend)
  getJobs: async (): Promise<Job[]> => {
    const response = await api.get('/jobs');
    return response.data;
  },

  // Get a single job by ID
  getJobById: async (id: string): Promise<Job> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create a new job (Employer only)
  createJob: async (jobData: CreateJobData): Promise<Job> => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update a job (Employer only)
  updateJob: async (id: string, jobData: Partial<CreateJobData>): Promise<Job> => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete a job (Employer only)
  deleteJob: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  // Get jobs posted by the current employer
  getMyJobs: async (): Promise<Job[]> => {
    const response = await api.get('/jobs/my-jobs');
    return response.data;
  },
};
