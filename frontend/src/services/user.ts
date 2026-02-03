import api from './api';
import type { AuthResponse } from './auth';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  companyName?: string;
  companyDescription?: string;
  companyWebsite?: string;
  companyLocation?: string;
  companyIndustry?: string;
  companySize?: string;
  militaryBranch?: string;
  persona?: {
    role?: string;
    yearsOfService?: string;
    skills?: string[];
    goals?: string;
    bio?: string;
  };
}

export const updateProfile = async (profileData: Partial<UserProfile>): Promise<AuthResponse> => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const getCandidates = async (jobId?: string) => {
  const query = jobId ? `?jobId=${jobId}` : '';
  const response = await api.get(`/users/candidates${query}`);
  return response.data;
};

export const saveCandidate = async (candidateId: string) => {
    const response = await api.post('/users/saved-candidates', { candidateId });
    return response.data;
};

export const unsaveCandidate = async (candidateId: string) => {
    const response = await api.delete(`/users/saved-candidates/${candidateId}`);
    return response.data;
};

export const getSavedCandidates = async () => {
    const response = await api.get('/users/saved-candidates');
    return response.data;
};
