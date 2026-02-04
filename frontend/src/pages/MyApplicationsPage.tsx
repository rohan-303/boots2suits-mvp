import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyApplications } from '../services/applicationService';
import { ArrowLeft, Briefcase, MapPin, Building, Clock, Calendar, CheckCircle, XCircle, User } from 'lucide-react';

export function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        setError('Failed to load applications.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center"><Clock className="w-3 h-3 mr-1" /> Applied</span>;
      case 'reviewing':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center"><User className="w-3 h-3 mr-1" /> Under Review</span>;
      case 'interviewing':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center"><Calendar className="w-3 h-3 mr-1" /> Interviewing</span>;
      case 'accepted':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Offer Received</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center"><XCircle className="w-3 h-3 mr-1" /> Not Selected</span>;
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
              <h1 className="text-3xl font-bold text-neutral-dark font-cinzel">My Applications</h1>
              <p className="text-neutral-gray mt-1">Track the status of your mission deployments.</p>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {error && (
           <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
             {error}
           </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-light p-12 text-center">
            <Briefcase className="w-16 h-16 text-neutral-gray/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-dark">No applications yet</h3>
            <p className="text-neutral-gray mt-1 mb-6">You haven't applied to any positions yet.</p>
            <button 
              onClick={() => navigate('/jobs')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-xl shadow-sm border border-neutral-light p-6 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="grow">
                    <div className="flex items-center gap-2 mb-2">
                       <h3 className="text-xl font-bold text-neutral-dark hover:text-primary cursor-pointer" onClick={() => navigate(`/jobs/${app.job._id}`)}>
                         {app.job.title}
                       </h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-gray mb-4">
                      <span className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {app.job.company}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {app.job.location}
                      </span>
                      <span className="px-2 py-0.5 bg-neutral-light rounded text-xs">
                        {app.job.type}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-gray/60">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center min-w-35">
                    {getStatusBadge(app.status)}
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
