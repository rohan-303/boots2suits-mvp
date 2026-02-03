import api from './api';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'veteran' | 'employer';
  companyName?: string;
  militaryBranch?: string;
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface AuthResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'veteran' | 'employer' | 'admin';
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
  token: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): AuthResponse | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};
