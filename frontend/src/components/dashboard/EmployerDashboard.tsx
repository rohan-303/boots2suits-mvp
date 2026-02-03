import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Plus, ArrowRight, Loader, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import type { Job } from '../../types/Job';

export function EmployerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getMyJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-light">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary-dark mb-2">
              Employer Dashboard
            </h1>
            <p className="text-neutral-gray text-lg">
              Manage your job postings and find top veteran talent for {user?.companyName || 'your company'}.
            </p>
          </div>
          <button
            onClick={() => navigate('/post-job')}
            className="hidden md:flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" /> Post Job
          </button>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Post a Job (Mobile/Quick Access) */}
        <div 
          onClick={() => navigate('/post-job')}
          className="bg-primary text-white p-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-shadow cursor-pointer group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Post a New Job</h3>
          <p className="text-primary-light mb-4 text-sm">
            Create a new listing to attract qualified veteran candidates.
          </p>
          <span className="font-semibold text-sm flex items-center">
            Create Listing <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Find Candidates */}
        <div 
          onClick={() => navigate('/candidates')}
          className="bg-white p-6 rounded-xl shadow-sm border border-neutral-light hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
            <Users className="w-6 h-6 text-accent-dark" />
          </div>
          <h3 className="text-xl font-bold text-neutral-dark mb-2">Search Candidates</h3>
          <p className="text-neutral-gray mb-4 text-sm">
            Browse our database of vetted veterans by skill, rank, or location.
          </p>
          <span className="text-accent-dark font-semibold text-sm flex items-center">
            Search Talent <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>

        {/* Company Profile */}
        <div 
          onClick={() => navigate('/company-profile')}
          className="bg-white p-6 rounded-xl shadow-sm border border-neutral-light hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="w-12 h-12 bg-neutral-light rounded-lg flex items-center justify-center mb-4 group-hover:bg-neutral-gray/20 transition-colors">
            <Building className="w-6 h-6 text-neutral-dark" />
          </div>
          <h3 className="text-xl font-bold text-neutral-dark mb-2">Company Profile</h3>
          <p className="text-neutral-gray mb-4 text-sm">
            Update your branding and "Why Hire Veterans" statement.
          </p>
          <span className="text-neutral-dark font-semibold text-sm flex items-center">
            Edit Profile <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>

      {/* Active Jobs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-light overflow-hidden">
        <div className="p-6 border-b border-neutral-light flex justify-between items-center">
          <h2 className="text-xl font-bold text-neutral-dark flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Active Job Postings
          </h2>
          <span className="text-sm text-neutral-gray bg-neutral-light px-3 py-1 rounded-full">
            {jobs.length} Active
          </span>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-neutral-gray">
            <p>No active jobs found. Post your first job to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-light">
            {jobs.map((job) => (
              <div key={job._id} className="p-6 hover:bg-neutral-light/10 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-dark hover:text-primary cursor-pointer" onClick={() => navigate(`/jobs/${job._id}`)}>
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-neutral-gray mt-1">
                      <span>{job.location}</span>
                      <span className="w-1 h-1 bg-neutral-gray rounded-full"></span>
                      <span>{job.type}</span>
                      <span className="w-1 h-1 bg-neutral-gray rounded-full"></span>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => navigate(`/employer/jobs/${job._id}/applicants`)}
                      className="flex-1 md:flex-none px-4 py-2 bg-white border border-neutral-light hover:border-primary text-neutral-dark hover:text-primary rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4" /> View Applicants
                    </button>
                    <button 
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="px-4 py-2 text-neutral-gray hover:text-neutral-dark transition-colors"
                    >
                      View Job
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
