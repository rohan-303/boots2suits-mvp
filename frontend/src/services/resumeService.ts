import api from './api';

export interface MilitaryHistory {
  branch: string;
  rank: string;
  mosCode: string;
  yearsOfService: number;
  securityClearance?: string;
  leadershipRole?: string;
  awards?: string;
  description?: string;
}

export interface ResumeData {
  _id: string;
  user: string;
  title: string;
  militaryHistory: MilitaryHistory;
  generatedSummary: string;
  generatedSkills: string[];
  generatedExperience: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeResponse {
  success: boolean;
  data: ResumeData;
}

export const createResume = async (militaryHistory: MilitaryHistory, title?: string) => {
  const response = await api.post<CreateResumeResponse>('/resume', {
    militaryHistory,
    title,
  });
  return response.data;
};

export const getMyResume = async () => {
  try {
    const response = await api.get<{ success: boolean; data: ResumeData }>('/resume/me');
    return response.data;
  } catch (error) {
    // If 404, it just means no resume yet
    return null;
  }
};

export const updateResume = async (resumeId: string, data: Partial<ResumeData>) => {
  const response = await api.put<{ success: boolean; data: ResumeData }>(`/resume/${resumeId}`, data);
  return response.data;
};

export const parseDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<{ success: boolean; data: MilitaryHistory }>('/resume/parse', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
