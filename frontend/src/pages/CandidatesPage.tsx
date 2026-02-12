import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Download, MessageSquare, Star, Eye, ShieldCheck, Flag, Loader2, Lock, CheckCircle } from 'lucide-react';
import { getCandidates, saveCandidate } from '../services/userService';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import type { Job } from '../types/Job';
import { CandidateProfileModal, type Candidate } from '../components/CandidateProfileModal';

export function CandidatesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Data State
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  // Save Modal State
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [candidateToSave, setCandidateToSave] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [saveNotes, setSaveNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    education: '',
    securityClearance: '',
    militaryBranch: '',
    location: ''
  });

  // Fetch Candidates
  const fetchCandidates = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await getCandidates(filters);
      setCandidates(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
      setError('Failed to load candidates. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Jobs (for Save Modal)
  useEffect(() => {
    if (user?.role === 'employer') {
      jobService.getMyJobs().then(setMyJobs).catch(console.error);
    }
  }, [user]);

  // Initial Fetch & Filter Effect
  useEffect(() => {
    // Debounce search slightly or just run on effect
    const timeoutId = setTimeout(() => {
      fetchCandidates();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [user, filters.education, filters.securityClearance, filters.militaryBranch, filters.location, filters.search]);

  // Handle Save
  const handleSaveCandidate = async () => {
    if (!candidateToSave) return;
    setIsSaving(true);
    try {
      await saveCandidate({
        candidateId: candidateToSave,
        jobId: selectedJobId || undefined,
        notes: saveNotes
      });
      // Show success feedback (could be a toast, but using alert for now/simple UI)
      alert('Candidate saved successfully!');
      setSaveModalOpen(false);
      setCandidateToSave(null);
      setSaveNotes('');
      setSelectedJobId('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save candidate');
    } finally {
      setIsSaving(false);
    }
  };

  const openSaveModal = (candidateId: string) => {
    setCandidateToSave(candidateId);
    setSaveModalOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      education: '',
      securityClearance: '',
      militaryBranch: '',
      location: ''
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-light sticky top-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-neutral-dark">Filter Candidates</h2>
            <button onClick={clearFilters} className="text-xs text-primary hover:underline">Reset</button>
          </div>
          
          <div className="space-y-6">
            {/* Search */}
            <div>
              <h3 className="font-medium text-sm text-neutral-dark mb-2">Keywords</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Skill, MOS, Role..." 
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Military Branch */}
            <div>
              <h3 className="font-medium text-sm text-neutral-dark mb-2">Military Branch</h3>
              <select 
                value={filters.militaryBranch}
                onChange={(e) => setFilters({...filters, militaryBranch: e.target.value})}
                className="w-full p-2 text-sm border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Any Branch</option>
                <option value="Army">Army</option>
                <option value="Navy">Navy</option>
                <option value="Air Force">Air Force</option>
                <option value="Marines">Marines</option>
                <option value="Coast Guard">Coast Guard</option>
                <option value="Space Force">Space Force</option>
              </select>
            </div>

            {/* Security Clearance */}
            <div>
              <h3 className="font-medium text-sm text-neutral-dark mb-3">Security Clearance</h3>
              <div className="space-y-2">
                {['Any', 'Secret', 'Top Secret', 'None'].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="securityClearance"
                      value={item === 'Any' ? '' : item}
                      checked={item === 'Any' ? filters.securityClearance === '' : filters.securityClearance === item}
                      onChange={(e) => setFilters({...filters, securityClearance: e.target.value})}
                      className="text-primary focus:ring-primary" 
                    />
                    <span className="text-sm text-neutral-gray">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Highest Education */}
            <div>
              <h3 className="font-medium text-sm text-neutral-dark mb-3">Highest Education</h3>
              <div className="space-y-2">
                {['Bachelor', 'Master', 'Doctorate'].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="education"
                      value={item}
                      checked={filters.education === item}
                      onChange={(e) => setFilters({...filters, education: e.target.value})}
                      className="text-primary focus:ring-primary" 
                    />
                    <span className="text-sm text-neutral-gray">{item}'s Degree</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-neutral-dark mb-2">Candidates</h1>
        <p className="text-neutral-gray mb-6">Browse matched veteran candidates for your job posts</p>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-neutral-dark font-medium">{candidates.length} candidates found</span>
        </div>

        {/* Candidate List */}
        {!user ? (
          <div className="bg-white rounded-lg border border-neutral-light p-12 text-center">
            <div className="w-16 h-16 bg-neutral-light/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-neutral-gray" />
            </div>
            <h2 className="text-xl font-bold text-neutral-dark mb-2">Access Restricted</h2>
            <p className="text-neutral-gray mb-6 max-w-md mx-auto">
              Please log in as an employer to view candidate profiles and connect with veterans.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/login" className="bg-primary hover:bg-primary-light text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Log In
              </Link>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-light">
            <p className="text-neutral-gray">No candidates found matching your criteria.</p>
            <button onClick={clearFilters} className="mt-4 text-primary font-medium hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate._id} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-light hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                    {candidate.firstName[0]}{candidate.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-dark">{candidate.firstName} {candidate.lastName}</h3>
                        <div className="text-sm text-neutral-gray mb-2">
                          {candidate.role} <span className="mx-1">|</span> {candidate.location}
                        </div>
                      </div>
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                         {candidate.militaryBranch && (
                           <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                             <Flag className="w-3 h-3" /> {candidate.militaryBranch}
                           </span>
                         )}
                         {candidate.persona?.securityClearance && candidate.persona.securityClearance !== 'None' && (
                           <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded font-medium">
                             <ShieldCheck className="w-3 h-3" /> {candidate.persona.securityClearance}
                           </span>
                         )}
                      </div>
                    </div>

                    <p className="text-neutral-gray text-sm mb-4 leading-relaxed line-clamp-2">
                      {candidate.resume?.summary || 'No summary available.'}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => setSelectedCandidate(candidate)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded text-sm hover:bg-primary-light transition-colors"
                      >
                        <Eye className="w-4 h-4" /> View Profile
                      </button>
                      
                      {candidate.resume?.fileUrl && (
                        <a 
                          href={candidate.resume.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 border border-neutral-light rounded text-sm font-medium text-neutral-dark hover:bg-neutral-50"
                        >
                          <Download className="w-4 h-4" /> Resume
                        </a>
                      )}
                      
                      <div className="flex-1 md:hidden"></div>
                      
                      <button 
                        onClick={() => navigate(`/messages?userId=${candidate._id}`, { 
                          state: { 
                            user: {
                              _id: candidate._id,
                              firstName: candidate.firstName,
                              lastName: candidate.lastName,
                              role: 'veteran'
                            }
                          }
                        })}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-primary font-medium rounded text-sm hover:bg-green-100"
                      >
                        <MessageSquare className="w-4 h-4" /> Message
                      </button>
                      
                      <button 
                        onClick={() => openSaveModal(candidate._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-50 border border-neutral-light text-neutral-dark font-medium rounded text-sm hover:bg-neutral-100"
                      >
                        <Star className="w-4 h-4" /> Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedCandidate && (
        <CandidateProfileModal 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
        />
      )}

      {/* Save Candidate Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-neutral-light">
              <h2 className="text-xl font-bold text-neutral-dark">Save Candidate</h2>
              <p className="text-sm text-neutral-gray">Shortlist this candidate for a specific job or general pool.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Select Job (Optional)</label>
                <select 
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full p-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="">-- General Save (No specific job) --</option>
                  {myJobs.map(job => (
                    <option key={job._id} value={job._id}>{job.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Notes (Optional)</label>
                <textarea 
                  value={saveNotes}
                  onChange={(e) => setSaveNotes(e.target.value)}
                  placeholder="Add private notes about this candidate..."
                  className="w-full p-2 border border-neutral-light rounded-lg h-24 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-neutral-light flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button 
                onClick={() => setSaveModalOpen(false)}
                className="px-4 py-2 text-neutral-gray hover:text-neutral-dark font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveCandidate}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition-colors disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Save Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
