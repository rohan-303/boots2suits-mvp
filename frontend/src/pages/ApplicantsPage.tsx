import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobApplications } from '../services/applicationService';
import { jobService } from '../services/jobService';
import type { Job } from '../types/Job';
import { ArrowLeft, User, Mail, Shield, FileText, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

export function ApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      try {
        const [jobData, appsData] = await Promise.all([
          jobService.getJobById(jobId),
          getJobApplications(jobId)
        ]);
        setJob(jobData);
        setApplications(appsData);
      } catch (err) {
        setError('Failed to load applicants.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center"><Clock className="w-3 h-3 mr-1" /> Applied</span>;
      case 'reviewing':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center"><User className="w-3 h-3 mr-1" /> Reviewing</span>;
      case 'interviewing':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center"><Calendar className="w-3 h-3 mr-1" /> Interviewing</span>;
      case 'accepted':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Accepted</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
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
          onClick={() => navigate('/dashboard')}
          className="text-primary hover:underline flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-neutral-gray hover:text-primary mb-4 flex items-center text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-neutral-dark font-cinzel">Applicants for {job.title}</h1>
              <p className="text-neutral-gray mt-1">{applications.length} candidate(s) found</p>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-light p-12 text-center">
            <User className="w-16 h-16 text-neutral-gray/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-dark">No applicants yet</h3>
            <p className="text-neutral-gray mt-1">Wait for veterans to discover your mission.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-xl shadow-sm border border-neutral-light p-6 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar / Initials */}
                  <div className="shrink-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                      {app.applicant.firstName[0]}{app.applicant.lastName[0]}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-dark">
                          {app.applicant.firstName} {app.applicant.lastName}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-neutral-gray">
                          <span className="flex items-center">
                            <Shield className="w-4 h-4 mr-1 text-secondary" />
                            {app.applicant.militaryBranch}
                          </span>
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {app.applicant.email}
                          </span>
                          <span className="text-xs text-neutral-gray/60">
                            Applied on {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div>
                        {getStatusBadge(app.status)}
                      </div>
                    </div>

                    {/* Persona Summary */}
                    {app.applicant.persona && (
                      <div className="mb-4 bg-neutral-light/30 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-neutral-dark mb-2">Professional Summary</h4>
                        <p className="text-neutral-gray text-sm line-clamp-3">
                          {app.applicant.persona.bio || app.applicant.persona.traits?.join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Resume Snapshot */}
                    {app.resume ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-dark mb-2 flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-primary" />
                            Top Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {app.resume.skills?.slice(0, 5).map((skill: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-neutral-light text-neutral-dark rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-dark mb-2">Military History</h4>
                          <p className="text-sm text-neutral-gray">{app.resume.militaryHistory || 'Not specified'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-neutral-gray italic">
                        No resume attached.
                      </div>
                    )}
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
