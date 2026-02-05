import api from './api';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'veteran' | 'employer';
  companyName?: string;
  companyDescription?: string;
  companyWebsite?: string;
  companyLocation?: string;
  companyIndustry?: string;
  companySize?: string;
  militaryBranch?: string;
  termsAccepted?: boolean;
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
  companyDescription?: string; // Legacy support
  companyWebsite?: string;     // Legacy support
  companyLocation?: string;    // Legacy support
  companyIndustry?: string;    // Legacy support
  companySize?: string;        // Legacy support
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
  token: string;
}

export interface GoogleAuthData {
  token: string;
  role?: string;
  militaryBranch?: string;
  companyName?: string;
}

export interface LinkedInAuthData {
  code: string;
  redirectUri: string;
  role?: string;
  militaryBranch?: string;
  companyName?: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const googleLogin = async (data: GoogleAuthData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/google', data);
  return response.data;
};

export const linkedinLogin = async (data: LinkedInAuthData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/linkedin', data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgotpassword', { email });
  return response.data;
};

export const resetPassword = async (password: string, token: string): Promise<AuthResponse> => {
  const response = await api.put<AuthResponse>(`/auth/resetpassword/${token}`, { password });
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
