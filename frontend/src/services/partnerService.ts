import api from './api';

export interface PartnerInquiryData {
  organizationName: string;
  contactName: string;
  email: string;
  type: string;
  message: string;
}

export const partnerService = {
  createInquiry: async (data: PartnerInquiryData) => {
    const response = await api.post('/partners', data);
    return response.data;
  },
  
  getInquiries: async () => {
    const response = await api.get('/partners');
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/partners/${id}/status`, { status });
    return response.data;
  }
};
