import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import type { CreateJobData } from '../types/Job';
import { ArrowLeft, Plus, X, Briefcase } from 'lucide-react';

export function CreateJobPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salaryRange: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    description: '',
    requirements: []
  });
  
  const [requirementInput, setRequirementInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'minSalary' || name === 'maxSalary') {
      setFormData(prev => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange!,
          [name === 'minSalary' ? 'min' : 'max']: Number(value)
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await jobService.createJob(formData);
      navigate('/jobs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light/30 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-2xl font-bold text-neutral-dark font-cinzel">Post a New Job</h1>
                <p className="text-sm text-neutral-gray">Create a job listing to find the best veteran talent.</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Job Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="e.g. Senior Software Engineer"
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
                  placeholder="e.g. Tech Corp"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="e.g. Remote, New York, NY"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Job Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Salary Range (USD)</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="minSalary"
                  placeholder="Min"
                  value={formData.salaryRange?.min || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <input
                  type="number"
                  name="maxSalary"
                  placeholder="Max"
                  value={formData.salaryRange?.max || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Description</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="Describe the role, responsibilities, and company culture..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Requirements</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                  className="grow px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Add a requirement (e.g. 5+ years of experience)"
                />
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="bg-neutral-dark text-white p-2 rounded-lg hover:bg-black transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center justify-between bg-neutral-light/20 p-3 rounded-lg border border-neutral-light">
                    <span className="text-sm text-neutral-dark">{req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-6 py-2 border border-neutral-light text-neutral-gray rounded-lg hover:bg-neutral-light/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
