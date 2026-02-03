import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import type { CreateJobData } from '../types/Job';
import { ArrowLeft, Plus, X, Briefcase, Building2, MapPin, DollarSign, Shield, Clock, Calendar } from 'lucide-react';

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function CreateJobPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    workplaceType: 'On-site',
    experienceLevel: 'Mid',
    salaryRange: {
      min: 0,
      max: 0,
      currency: 'USD',
      period: 'Yearly'
    },
    description: '',
    requirements: [],
    skills: [],
    benefits: [],
    clearanceLevel: 'None',
    applicationDeadline: ''
  });
  
  const [inputs, setInputs] = useState({
    requirement: '',
    skill: '',
    benefit: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (['min', 'max', 'period'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange!,
          [name]: name === 'period' ? value : Number(value)
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayInput = (field: 'requirements' | 'skills' | 'benefits', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setInputs(prev => ({ ...prev, [field === 'requirements' ? 'requirement' : field === 'skills' ? 'skill' : 'benefit']: '' }));
    }
  };

  const removeArrayItem = (field: 'requirements' | 'skills' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await jobService.createJob(formData);
      navigate('/jobs');
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
    <div className="flex items-center gap-2 mb-4 text-primary border-b border-neutral-light pb-2">
      <Icon className="w-5 h-5" />
      <h2 className="text-lg font-semibold font-cinzel">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-light/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/jobs')}
          className="flex items-center text-neutral-gray hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>
        
        <div className="bg-white rounded-xl shadow-lg border border-neutral-light overflow-hidden">
          <div className="bg-primary/5 p-6 border-b border-neutral-light">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark font-cinzel">Post a Professional Job</h1>
                <p className="text-sm text-neutral-gray">Create a detailed job listing to attract top veteran talent.</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
            
            {/* Core Details */}
            <section>
              <SectionHeader icon={Building2} title="Core Details" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. Senior Security Analyst"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="e.g. Defense Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-neutral-gray" />
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="e.g. Arlington, VA"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Workplace Type</label>
                  <select
                    name="workplaceType"
                    value={formData.workplaceType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Employment Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Classification */}
            <section>
              <SectionHeader icon={Shield} title="Classification & Clearance" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  >
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                    <option value="Director">Director</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Security Clearance</label>
                  <select
                    name="clearanceLevel"
                    value={formData.clearanceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  >
                    <option value="None">None</option>
                    <option value="Public Trust">Public Trust</option>
                    <option value="Secret">Secret</option>
                    <option value="Top Secret">Top Secret</option>
                    <option value="Top Secret/SCI">Top Secret/SCI</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Compensation */}
            <section>
              <SectionHeader icon={DollarSign} title="Compensation" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Minimum Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-neutral-gray">$</span>
                    <input
                      type="number"
                      name="min"
                      value={formData.salaryRange?.min || ''}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Maximum Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-neutral-gray">$</span>
                    <input
                      type="number"
                      name="max"
                      value={formData.salaryRange?.max || ''}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Payment Period</label>
                  <select
                    name="period"
                    value={formData.salaryRange?.period}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  >
                    <option value="Yearly">Yearly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Description */}
            <section>
              <SectionHeader icon={Briefcase} title="Job Description" />
              <div>
                <textarea
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Provide a comprehensive description of the role, responsibilities, and team culture..."
                />
              </div>
            </section>

            {/* Lists: Requirements, Skills, Benefits */}
            <section className="space-y-6">
              <SectionHeader icon={Clock} title="Requirements & Benefits" />
              
              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Key Requirements</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={inputs.requirement}
                    onChange={(e) => setInputs(prev => ({ ...prev, requirement: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayInput('requirements', inputs.requirement))}
                    className="flex-1 px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Add a requirement..."
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayInput('requirements', inputs.requirement)}
                    className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((req, index) => (
                    <span key={index} className="bg-neutral-light/50 text-neutral-dark px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {req}
                      <button type="button" onClick={() => removeArrayItem('requirements', index)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Required Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={inputs.skill}
                    onChange={(e) => setInputs(prev => ({ ...prev, skill: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayInput('skills', inputs.skill))}
                    className="flex-1 px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Add a skill (e.g. React, Leadership)..."
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayInput('skills', inputs.skill)}
                    className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-blue-100">
                      {skill}
                      <button type="button" onClick={() => removeArrayItem('skills', index)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Benefits</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={inputs.benefit}
                    onChange={(e) => setInputs(prev => ({ ...prev, benefit: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayInput('benefits', inputs.benefit))}
                    className="flex-1 px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Add a benefit (e.g. Health Insurance, 401k)..."
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayInput('benefits', inputs.benefit)}
                    className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit, index) => (
                    <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-green-100">
                      {benefit}
                      <button type="button" onClick={() => removeArrayItem('benefits', index)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Application Deadline */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Application Deadline</label>
                <div className="relative max-w-xs">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-neutral-gray" />
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            <div className="pt-6 border-t border-neutral-light flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-6 py-2 border border-neutral-light rounded-lg hover:bg-neutral-light/50 transition-colors text-neutral-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
