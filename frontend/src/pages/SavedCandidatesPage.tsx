import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSavedCandidates, getCandidateById } from '../services/userService';
import { CandidateProfileModal, type Candidate } from '../components/CandidateProfileModal';
import { Star, MessageSquare, Eye, ArrowRight, Loader2 } from 'lucide-react';

interface SavedCandidateItem {
  _id: string;
  employer: string;
  candidate: Candidate;
  job?: {
    _id: string;
    title: string;
    location: string;
  };
  notes?: string;
  createdAt: string;
}

export function SavedCandidatesPage() {
  const [savedItems, setSavedItems] = useState<SavedCandidateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedCandidates();
  }, []);

  const fetchSavedCandidates = async () => {
    setIsLoading(true);
    try {
      const data = await getSavedCandidates();
      setSavedItems(data);
    } catch (error) {
      console.error('Failed to fetch saved candidates', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = async (candidateId: string) => {
    try {
      // Fetch full candidate details including resume
      const candidate = await getCandidateById(candidateId);
      setSelectedCandidate(candidate);
    } catch (error) {
      console.error('Failed to fetch candidate details', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-dark">Saved Candidates</h1>
          <p className="text-neutral-gray mt-2">Manage your shortlisted veterans and potential hires.</p>
        </div>
        <Link to="/candidates" className="text-primary hover:underline flex items-center gap-1">
          Browse More Candidates <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : savedItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-neutral-light p-12 text-center">
          <div className="w-16 h-16 bg-neutral-light/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-neutral-gray" />
          </div>
          <h2 className="text-xl font-bold text-neutral-dark mb-2">No Saved Candidates</h2>
          <p className="text-neutral-gray mb-6">You haven't shortlisted any candidates yet.</p>
          <Link to="/candidates" className="bg-primary hover:bg-primary-light text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block">
            Find Candidates
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {savedItems.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-light flex flex-col md:flex-row gap-6">
              {/* Candidate Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {item.candidate.firstName?.[0]}{item.candidate.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-dark">{item.candidate.firstName} {item.candidate.lastName}</h3>
                    <p className="text-sm text-neutral-gray">{item.candidate.role || 'Veteran'} • {item.candidate.location || 'USA'}</p>
                    {item.candidate.militaryBranch && (
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded mt-1">
                        {item.candidate.militaryBranch}
                      </span>
                    )}
                  </div>
                </div>

                {/* Notes & Job Association */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-neutral-light/50">
                  {item.job ? (
                    <div className="mb-2">
                      <span className="text-xs font-bold text-neutral-gray uppercase tracking-wider">Shortlisted For</span>
                      <p className="text-sm font-medium text-primary">{item.job.title} <span className="text-neutral-gray font-normal">({item.job.location})</span></p>
                    </div>
                  ) : (
                    <div className="mb-2">
                       <span className="text-xs font-bold text-neutral-gray uppercase tracking-wider">General Shortlist</span>
                    </div>
                  )}
                  
                  {item.notes && (
                    <div>
                      <span className="text-xs font-bold text-neutral-gray uppercase tracking-wider">Notes</span>
                      <p className="text-sm text-neutral-dark italic">"{item.notes}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-neutral-light pt-4 md:pt-0 md:pl-6 min-w-45">
                <button 
                  onClick={() => handleViewProfile(item.candidate._id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-neutral-light text-neutral-dark font-medium rounded hover:bg-gray-50 transition-colors w-full"
                >
                  <Eye className="w-4 h-4" /> View Profile
                </button>
                
                <button 
                  onClick={() => navigate(`/messages?userId=${item.candidate._id}`)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded hover:bg-primary-light transition-colors w-full"
                >
                  <MessageSquare className="w-4 h-4" /> Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCandidate && (
        <CandidateProfileModal 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
        />
      )}
    </div>
  );
}
