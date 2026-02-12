import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applyForJob } from '../services/applicationService';
import type { Job } from '../types/Job';
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Building, 
  ArrowLeft, 
  CheckCircle, 
  Shield, 
  GraduationCap, 
  Calendar, 
  Users,
  Target
} from 'lucide-react';
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-light/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/jobs')}
          className="flex items-center text-neutral-gray hover:text-primary mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Hero Card */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-light overflow-hidden">
              <div className="p-8 border-b border-neutral-light">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-20 h-20 bg-primary/5 rounded-xl border border-neutral-light flex items-center justify-center text-primary font-bold text-3xl shrink-0">
                    {job.company.charAt(0)}
                  </div>
                  <div className="grow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-neutral-dark font-heading">{job.title}</h1>
                        <div className="flex items-center gap-2 text-lg text-neutral-gray mt-1 font-medium">
                          <Building className="w-5 h-5" />
                          {job.company}
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                         <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                           job.isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                         }`}>
                          {job.isActive ? 'Active Hiring' : 'Closed'}
                        </span>
                        <span className="text-sm text-neutral-gray flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-light/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-neutral-gray" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-gray uppercase font-bold tracking-wider">Location</p>
                          <p className="text-sm font-semibold text-neutral-dark">{job.city}, {job.state}</p>
                          <p className="text-xs text-neutral-gray">({job.workMode})</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-50 rounded-lg">
                          <Briefcase className="w-5 h-5 text-neutral-gray" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-gray uppercase font-bold tracking-wider">Job Type</p>
                          <p className="text-sm font-semibold text-neutral-dark">{job.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-50 rounded-lg">
                          <DollarSign className="w-5 h-5 text-neutral-gray" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-gray uppercase font-bold tracking-wider">Salary</p>
                          <p className="text-sm font-semibold text-neutral-dark">
                            {job.salaryRange && job.salaryRange.min != null && job.salaryRange.max != null ? (
                              `${job.salaryRange.currency} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`
                            ) : (
                              'Competitive'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Veteran Preferences Card */}
            {(job.veteranPreferences?.securityClearance || job.veteranPreferences?.militaryBranch || (job.veteranPreferences?.mosCodes && job.veteranPreferences.mosCodes.length > 0)) && (
              <div className="bg-linear-to-r from-[#1e293b] to-[#334155] rounded-xl shadow-md overflow-hidden text-white relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Shield className="w-32 h-32" />
                </div>
                <div className="p-6 relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                      <Shield className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-xl font-bold text-white font-heading tracking-wide">Veteran Requirements</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {job.veteranPreferences.securityClearance && (
                      <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                        <p className="text-accent text-xs font-bold uppercase tracking-wider mb-1">Security Clearance</p>
                        <p className="font-semibold text-lg">{job.veteranPreferences.securityClearance}</p>
                      </div>
                    )}
                    
                    {job.veteranPreferences.militaryBranch && (
                      <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                        <p className="text-accent text-xs font-bold uppercase tracking-wider mb-1">Preferred Branch</p>
                        <p className="font-semibold text-lg">{job.veteranPreferences.militaryBranch}</p>
                      </div>
                    )}

                    {job.veteranPreferences.mosCodes && job.veteranPreferences.mosCodes.length > 0 && (
                      <div className="md:col-span-2 bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                        <p className="text-accent text-xs font-bold uppercase tracking-wider mb-2">Target MOS / AFSC Codes</p>
                        <div className="flex flex-wrap gap-2">
                          {job.veteranPreferences.mosCodes.map((code, idx) => (
                            <span key={idx} className="bg-accent text-primary-dark px-3 py-1 rounded-md text-sm font-bold shadow-sm">
                              {code}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-light p-8">
              <h3 className="text-xl font-bold text-neutral-dark mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                Job Description
              </h3>
              <div className="prose prose-neutral max-w-none text-neutral-dark/80 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </div>
            </div>

             {/* Responsibilities */}
             {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-light p-8">
                <h3 className="text-xl font-bold text-neutral-dark mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  Key Responsibilities
                </h3>
                <ul className="space-y-4">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-neutral-dark/80 leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
             )}

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-light p-8">
              <h3 className="text-xl font-bold text-neutral-dark mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                Requirements
              </h3>
              <ul className="space-y-4">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-4 p-4 bg-neutral-light/30 rounded-lg border border-neutral-light/50">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-neutral-dark font-medium">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Action Card */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-light p-6 sticky top-6">
              {user?.role === 'veteran' ? (
                 <>
                  {applySuccess ? (
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-center font-bold flex flex-col items-center gap-2">
                      <CheckCircle className="w-8 h-8" />
                      Application Sent Successfully!
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={handleApply}
                        disabled={applying || !job.isActive}
                        className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                      >
                        {applying ? 'Submitting...' : 'Apply Now'}
                      </button>
                      {applyError && (
                        <p className="mt-3 text-sm text-red-600 text-center font-medium bg-red-50 p-2 rounded-lg border border-red-100">{applyError}</p>
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
                        className="w-full mt-4 bg-white border-2 border-primary text-primary font-bold py-3 px-6 rounded-xl transition-all hover:bg-primary/5 flex items-center justify-center gap-2"
                      >
                        Message Employer
                      </button>
                    </>
                  )}
                 </>
              ) : (
                <div className="text-center p-4 bg-neutral-light/30 rounded-lg border border-neutral-light">
                  <p className="text-neutral-gray font-medium">Employer View</p>
                  <button 
                    onClick={() => navigate(`/employer/jobs/${job._id}/applicants`)}
                    className="w-full mt-3 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    View Applicants
                  </button>
                </div>
              )}

              {/* Quick Specs */}
              <div className="mt-8 space-y-6 border-t border-neutral-light pt-8">
                <div>
                  <h4 className="text-sm font-bold text-neutral-gray uppercase tracking-wider mb-3">Job Overview</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-neutral-gray shrink-0" />
                      <div>
                        <p className="text-xs text-neutral-gray">Education</p>
                        <p className="text-sm font-medium text-neutral-dark">
                          {job.educationLevel || 'Not specified'} 
                          {job.educationField && <span className="text-neutral-gray"> in {job.educationField}</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-neutral-gray shrink-0" />
                      <div>
                        <p className="text-xs text-neutral-gray">Experience</p>
                        <p className="text-sm font-medium text-neutral-dark">
                          {job.workExperience ? `${job.workExperience.min} - ${job.workExperience.max || '+'} years` : 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-neutral-gray shrink-0" />
                      <div>
                        <p className="text-xs text-neutral-gray">Openings</p>
                        <p className="text-sm font-medium text-neutral-dark">{job.openings} Position{job.openings !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {job.hiringTimeline && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-neutral-gray shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-gray">Hiring Timeline</p>
                          <p className="text-sm font-medium text-neutral-dark">
                            {formatDate(job.hiringTimeline.startDate)} - {formatDate(job.hiringTimeline.endDate)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                     {job.workTimings && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-neutral-gray shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-gray">Shift Timings</p>
                          <p className="text-sm font-medium text-neutral-dark">
                            {job.workTimings.startTime} - {job.workTimings.endTime}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {job.keySkills && job.keySkills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-neutral-gray uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Key Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.keySkills.map((skill, idx) => (
                        <span key={idx} className="bg-neutral-light text-neutral-dark px-3 py-1 rounded-full text-xs font-semibold border border-neutral-gray/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
