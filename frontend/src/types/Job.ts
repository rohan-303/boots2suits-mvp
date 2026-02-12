export interface Job {
  _id: string;
  title: string;
  company: string;
  companyId?: string | { _id: string; name: string; logo?: string }; // Can be string or populated object
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  workExperience?: {
    min: number;
    max?: number;
  };
  educationLevel?: string;
  educationField?: string;
  keySkills: string[];
  openings: number;
  workTimings?: {
    startTime: string;
    endTime: string;
  };
  hiringTimeline?: {
    startDate: string;
    endDate: string;
  };
  state?: string;
  city?: string;
  country?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  veteranPreferences?: {
    securityClearance?: string;
    militaryBranch?: string;
    mosCodes?: string[];
    rankCategory?: string;
  };
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
  workMode: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  workExperience?: {
    min: number;
    max?: number;
  };
  educationLevel?: string;
  educationField?: string;
  keySkills: string[];
  openings: number;
  workTimings?: {
    startTime: string;
    endTime: string;
  };
  hiringTimeline?: {
    startDate: string;
    endDate: string;
  };
  state?: string;
  city?: string;
  country?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  veteranPreferences?: {
    securityClearance?: string;
    militaryBranch?: string;
    mosCodes?: string[];
    rankCategory?: string;
  };
}
