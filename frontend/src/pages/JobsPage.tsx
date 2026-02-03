import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import type { Job } from '../types/Job';
import { MapPin, Briefcase, DollarSign, Clock, Building, Search, Shield, Laptop } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        console.log('Fetching jobs...');
        const data = await jobService.getJobs();
        console.log('Jobs fetched:', data);
        setJobs(data);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to load jobs. Please try again later.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-light/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-neutral-dark font-cinzel">Job Board</h1>
              <div className="text-xs text-gray-400">
                API: {import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'}
              </div>
            </div>
            <p className="text-neutral-gray mt-1">Find your next mission in the corporate world.</p>
          </div>
          
          {user?.role === 'employer' && (
            <button
              onClick={() => navigate('/post-job')}
              className="bg-primary hover:bg-primary-light text-white font-medium py-2.5 px-6 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Briefcase className="w-5 h-5" />
              Post a Job
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-light mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-gray" />
            </div>
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              className="block w-full pl-10 pr-3 py-3 border border-neutral-light rounded-lg leading-5 bg-neutral-light/10 placeholder-neutral-gray focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-light">
            <Briefcase className="w-16 h-16 text-neutral-gray/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-dark">No jobs found</h3>
            <p className="text-neutral-gray mt-1">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div 
                key={job._id} 
                className="bg-white rounded-xl shadow-sm border border-neutral-light hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row gap-6 cursor-pointer"
                onClick={() => navigate(`/jobs/${job._id}`)}
              >
                <div className="shrink-0 w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary font-bold text-xl border border-neutral-light group-hover:border-primary transition-colors">
                  {job.company.charAt(0)}
                </div>
                
                <div className="grow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-dark hover:text-primary transition-colors">
                        {job.title}
                      </h2>
                      <div className="flex items-center gap-2 text-neutral-gray mt-1">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {job.clearanceLevel && job.clearanceLevel !== 'None' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Shield className="w-3 h-3 mr-1" />
                          {job.clearanceLevel}
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        <Laptop className="w-3 h-3 mr-1" />
                        {job.workplaceType || 'On-site'}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        {job.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-gray">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      {job.salaryRange && job.salaryRange.min != null && job.salaryRange.max != null ? (
                        `${job.salaryRange.currency} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`
                      ) : (
                        'Competitive Salary'
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="mt-4 text-neutral-dark/80 line-clamp-2">
                    {job.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
