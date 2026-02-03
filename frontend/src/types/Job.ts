export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Internship';
  workplaceType: 'On-site' | 'Hybrid' | 'Remote';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Director' | 'Executive';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    period: 'Hourly' | 'Monthly' | 'Yearly';
  };
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  clearanceLevel: 'None' | 'Public Trust' | 'Secret' | 'Top Secret' | 'Top Secret/SCI';
  applicationDeadline?: string;
  postedBy: {
    _id: string;
    name: string;
    email: string;
    company: string;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CreateJobData {
  title: string;
  company: string;
  location: string;
  type: string;
  workplaceType: string;
  experienceLevel: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    period: 'Hourly' | 'Monthly' | 'Yearly';
  };
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  clearanceLevel: string;
  applicationDeadline?: string;
}
