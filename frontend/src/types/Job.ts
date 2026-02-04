export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
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
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
}
