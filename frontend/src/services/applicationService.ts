import api from './api';

export interface Application {
  _id: string;
  job: any;
  applicant: any;
  status: 'applied' | 'reviewing' | 'interviewing' | 'rejected' | 'accepted';
  appliedAt: string;
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
