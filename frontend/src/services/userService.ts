import api from './api';
import type { AuthResponse } from './authService';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  companyName?: string;
  militaryBranch?: string;
  persona?: {
    role?: string;
    yearsOfService?: string;
    skills?: string[];
    goals?: string;
    bio?: string;
  };
  companyProfile?: {
    website?: string;
    description?: string;
    industry?: string;
    location?: string;
    size?: string;
    logo?: string;
  };
}

export const updateProfile = async (profileData: Partial<UserProfile>): Promise<AuthResponse> => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const getCandidates = async (filters: any = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) params.append(key, filters[key]);
  });
  const response = await api.get(`/users/candidates?${params.toString()}`);
  return response.data;
};

export const saveCandidate = async (data: { candidateId: string; jobId?: string; notes?: string }) => {
  const response = await api.post('/users/saved', data);
  return response.data;
};

export const getSavedCandidates = async () => {
  const response = await api.get('/users/saved');
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const getCandidateById = async (id: string) => {
  const response = await api.get(`/users/candidates/${id}`);
  return response.data;
};
