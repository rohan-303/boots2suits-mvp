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

export const getCandidates = async () => {
  const response = await api.get('/users/candidates');
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
