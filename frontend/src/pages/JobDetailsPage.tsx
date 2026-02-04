import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applyForJob } from '../services/applicationService';
import type { Job } from '../types/Job';
import { MapPin, Briefcase, DollarSign, Clock, Building, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const data = await jobService.getJobById(id);
        setJob(data);
      } catch (err) {
        setError('Failed to load job details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!id) return;
    setApplying(true);
    setApplyError('');
    try {
      await applyForJob(id);
      setApplySuccess(true);
    } catch (err: any) {
      setApplyError(err.response?.data?.message || 'Failed to apply for job');
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/jobs')}
          className="flex items-center text-neutral-gray hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-neutral-light overflow-hidden">
          {/* Header */}
          <div className="bg-primary/5 p-8 border-b border-neutral-light">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary font-bold text-3xl border border-neutral-light">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-neutral-dark font-cinzel">{job.title}</h1>
                  <div className="flex items-center gap-2 text-lg text-neutral-dark/80 mt-1">
                    <Building className="w-5 h-5 text-neutral-gray" />
                    {job.company}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                 <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                  {job.type}
                </span>
                <div className="flex items-center gap-1.5 text-sm text-neutral-gray">
                  <Clock className="w-4 h-4" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="text-lg font-bold text-neutral-dark mb-4 border-b border-neutral-light pb-2">Description</h3>
                <div className="prose prose-neutral max-w-none text-neutral-dark/80 whitespace-pre-wrap">
                  {job.description}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-neutral-dark mb-4 border-b border-neutral-light pb-2">Requirements</h3>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-neutral-dark/80">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-neutral-light/20 p-6 rounded-xl border border-neutral-light">
                <h3 className="font-bold text-neutral-dark mb-4">Job Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-gray uppercase font-bold">Location</p>
                      <p className="text-sm font-medium text-neutral-dark">{job.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-gray uppercase font-bold">Salary</p>
                      <p className="text-sm font-medium text-neutral-dark">
                        {job.salaryRange && job.salaryRange.min != null && job.salaryRange.max != null ? (
                          `${job.salaryRange.currency} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`
                        ) : (
                          'Competitive'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-gray uppercase font-bold">Job Type</p>
                      <p className="text-sm font-medium text-neutral-dark">{job.type}</p>
                    </div>
                  </div>
                </div>

                {user?.role === 'veteran' && (
                  <>
                    {applySuccess ? (
                      <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-center font-medium">
                        Application Sent!
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={handleApply}
                          disabled={applying}
                          className="w-full mt-6 bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                          {applying ? 'Applying...' : 'Apply Now'}
                        </button>
                        {applyError && (
                          <p className="mt-2 text-sm text-red-600 text-center">{applyError}</p>
                        )}
                        <button 
                          onClick={() => navigate(`/messages?userId=${job.postedBy._id}`, {
                            state: {
                              user: {
                                _id: job.postedBy._id,
                                firstName: job.postedBy.name.split(' ')[0],
                                lastName: job.postedBy.name.split(' ').slice(1).join(' ') || '',
                                role: 'employer',
                                image: `https://ui-avatars.com/api/?name=${job.postedBy.name}&background=random`
                              }
                            }
                          })}
                          className="w-full mt-3 bg-white border border-primary text-primary font-bold py-3 px-6 rounded-lg transition-all hover:bg-neutral-50 flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          Message Employer
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
