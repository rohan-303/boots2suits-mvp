import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applyForJob } from '../services/application';
import type { Job } from '../types/Job';
import { MapPin, Briefcase, DollarSign, Clock, Building, ArrowLeft, CheckCircle, Shield, Award, Heart, Laptop, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!id) return;
        const data = await jobService.getJobById(id);
        setJob(data);
      } catch (err: unknown) {
        const error = err as ApiError;
        setError(error.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!job || !user) return;
    
    setApplying(true);
    try {
      await applyForJob(job._id);
      setApplySuccess(true);
    } catch (err: unknown) {
      const error = err as ApiError;
      alert(error.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-light/30">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-light/30">
        <div className="text-red-600 font-medium mb-4">{error || 'Job not found'}</div>
        <button 
          onClick={() => navigate('/jobs')}
          className="text-primary hover:underline flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/jobs')}
          className="flex items-center text-neutral-gray hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-neutral-light overflow-hidden">
              <div className="bg-primary/5 p-8 border-b border-neutral-light">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary font-bold text-3xl border border-neutral-light shrink-0">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-neutral-dark font-cinzel">{job.title}</h1>
                      <div className="flex items-center gap-2 text-lg text-neutral-dark/80 mt-1">
                        <Building className="w-5 h-5 text-neutral-gray" />
                        {job.company}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.clearanceLevel && job.clearanceLevel !== 'None' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Shield className="w-3 h-3 mr-1" />
                            {job.clearanceLevel}
                          </span>
                        )}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {job.workplaceType || 'On-site'}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-neutral-dark mb-4 border-b border-neutral-light pb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Description
                  </h3>
                  <div className="prose prose-neutral max-w-none text-neutral-dark/80 whitespace-pre-wrap">
                    {job.description}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-neutral-dark mb-4 border-b border-neutral-light pb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Key Requirements
                  </h3>
                  <ul className="space-y-3">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 text-neutral-dark/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {job.skills && job.skills.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-neutral-dark mb-4 border-b border-neutral-light pb-2 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1.5 bg-neutral-light/50 text-neutral-dark rounded-lg text-sm border border-neutral-light">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {job.benefits && job.benefits.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-neutral-dark mb-4 border-b border-neutral-light pb-2 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      Benefits
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-neutral-dark/80">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-neutral-light shadow-lg">
              <h3 className="font-bold text-neutral-dark mb-4 text-lg font-cinzel">Job Overview</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-gray uppercase font-bold tracking-wider">Salary Range</p>
                    <p className="text-sm font-medium text-neutral-dark mt-0.5">
                      {job.salaryRange && job.salaryRange.min != null && job.salaryRange.max != null ? (
                        `${job.salaryRange.currency} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()} / ${job.salaryRange.period || 'Year'}`
                      ) : (
                        'Competitive'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-gray uppercase font-bold tracking-wider">Location</p>
                    <p className="text-sm font-medium text-neutral-dark mt-0.5">{job.location}</p>
                    <p className="text-xs text-neutral-gray mt-0.5">{job.workplaceType || 'On-site'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-gray uppercase font-bold tracking-wider">Experience Level</p>
                    <p className="text-sm font-medium text-neutral-dark mt-0.5">{job.experienceLevel || 'Mid Level'}</p>
                  </div>
                </div>

                {job.applicationDeadline && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-gray uppercase font-bold tracking-wider">Deadline</p>
                      <p className="text-sm font-medium text-neutral-dark mt-0.5">
                        {new Date(job.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-gray uppercase font-bold tracking-wider">Posted</p>
                    <p className="text-sm font-medium text-neutral-dark mt-0.5">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-light">
                {user?.role === 'veteran' && (
                  <>
                    {applySuccess ? (
                      <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-center font-medium flex flex-col items-center gap-2">
                        <CheckCircle className="w-8 h-8" />
                        Application Sent Successfully!
                      </div>
                    ) : (
                      <button 
                        onClick={handleApply}
                        disabled={applying}
                        className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-bold shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                      >
                        {applying ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Apply Now'
                        )}
                      </button>
                    )}
                  </>
                )}
                
                {user?.role === 'employer' && user._id === job.postedBy._id && (
                  <button 
                    onClick={() => navigate(`/dashboard`)}
                    className="w-full py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-all font-bold"
                  >
                    Manage Application
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
