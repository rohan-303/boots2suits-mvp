import api from './api';

export interface Story {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  title: string;
  content: string;
  militaryBranch: string;
  currentRole: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CreateStoryData {
  title: string;
  content: string;
  militaryBranch: string;
  currentRole: string;
}

export const storyService = {
  getStories: async (status?: string): Promise<Story[]> => {
    const response = await api.get(status ? `/stories?status=${status}` : '/stories');
    return response.data;
  },

  createStory: async (data: CreateStoryData): Promise<Story> => {
    const response = await api.post('/stories', data);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Story> => {
    const response = await api.put(`/stories/${id}/status`, { status });
    return response.data;
  }
};
