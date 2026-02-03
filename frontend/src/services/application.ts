import api from './api';
import type { Job } from '../types/Job';
import type { AuthResponse } from './auth';
import type { ResumeData } from './resume';

export interface Application {
  _id: string;
  job: Job;
  applicant: AuthResponse;
  status: 'applied' | 'reviewing' | 'interviewing' | 'rejected' | 'accepted';
  appliedAt: string;
  resume?: ResumeData;
}

export const applyForJob = async (jobId: string) => {
  const response = await api.post(`/applications/${jobId}`);
  return response.data;
};

export const getJobApplications = async (jobId: string) => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get('/applications/my');
  return response.data;
};
