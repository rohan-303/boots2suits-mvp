import api from './api';

export interface Company {
  _id: string;
  name: string;
  industry: string;
  website?: string;
  description?: string;
  location?: string;
  size?: string;
  logo?: string;
  verified: boolean;
}

export const createCompany = async (companyData: Partial<Company>) => {
  const response = await api.post('/companies', companyData);
  return response.data;
};

export const getCompanies = async (keyword?: string) => {
  const response = await api.get(`/companies${keyword ? `?keyword=${keyword}` : ''}`);
  return response.data;
};

export const getCompanyById = async (id: string) => {
  const response = await api.get(`/companies/${id}`);
  return response.data;
};

export const joinCompany = async (companyId: string) => {
  const response = await api.put('/companies/join', { companyId });
  return response.data;
};

export const updateCompany = async (id: string, companyData: Partial<Company>) => {
  const response = await api.put(`/companies/${id}`, companyData);
  return response.data;
};
