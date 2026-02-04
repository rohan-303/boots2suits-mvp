import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, FileText, Download, MessageSquare, Star, Eye, ShieldCheck, Flag, Loader2, X, Lock } from 'lucide-react';
import { getCandidates } from '../services/userService';
import { useAuth } from '../context/AuthContext';

interface Candidate {
  id: string;
  name: string;
  role: string;
  location: string;
  matchScore: number;
  badges: string[];
  summary: string;
  image: string;
  skills?: string[];
  experience?: string[];
  militaryHistory?: {
    branch: string;
    rank: string;
    yearsOfService: number;
    securityClearance?: string;
  };
}

export function CandidatesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchCandidates = async () => {
      try {
        const data = await getCandidates();
        // Map backend data to UI format
        const mappedCandidates = data.map((u: any) => ({
          id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          role: u.resume?.title || `${u.militaryBranch} Veteran`,
          location: u.location || 'USA',
          matchScore: Math.floor(Math.random() * (99 - 80) + 80), // Mock score for MVP
          badges: [
            'Veteran', 
            u.militaryBranch, 
            u.resume?.militaryHistory?.securityClearance ? `Clearance: ${u.resume.militaryHistory.securityClearance}` : null
          ].filter(Boolean),
          summary: u.resume?.summary || `Dedicated ${u.militaryBranch} veteran ready to transition to civilian workforce.`,
          image: `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=random`,
          skills: u.resume?.skills || [],
          experience: u.resume?.experience || [],
          militaryHistory: u.resume?.militaryHistory
        }));
        setCandidates(mappedCandidates);
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
        setError('Failed to load candidates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [user]);

  return (
    <div className="flex gap-8">
      {/* Filters Sidebar */}
      <div className="w-64 shrink-0">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-light">
          <h2 className="font-bold text-lg mb-4 text-neutral-dark">Filter Candidates</h2>
          
          <div className="space-y-6">
            {/* Highest Education */}
            <div>
              <h3 className="font-medium text-sm text-neutral-dark mb-3">Highest Education</h3>
              <div className="space-y-2">
                {['High School', 'Associate\'s Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate'].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="education" className="text-primary focus:ring-primary" />
                    <span className="text-sm text-neutral-gray">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Security Clearance */}
            <div>
              <h3 className="font-medium text-sm text-neutral-dark mb-3">Security Clearance</h3>
              <div className="space-y-2">
                {['Secret', 'Top Secret', 'None'].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={item === 'Top Secret'} className="rounded text-primary focus:ring-primary" />
                    <span className="text-sm text-neutral-gray">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Citizenship */}
            <div>
              <h3 className="font-medium text-sm text-neutral-dark mb-3">Citizenship Status</h3>
              <div className="space-y-2">
                {['U.S. Citizen', 'Green Card Holder', 'Other'].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="citizenship" defaultChecked={item === 'U.S. Citizen'} className="text-primary focus:ring-primary" />
                    <span className="text-sm text-neutral-gray">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-neutral-dark mb-2">Candidates</h1>
        <p className="text-neutral-gray mb-6">Browse matched veteran candidates for your job posts</p>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, skills, or keywords" 
              className="w-full pl-10 pr-4 py-3 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="bg-primary hover:bg-primary-light text-white font-medium py-3 px-8 rounded-lg transition-colors">
            Search Results
          </button>
        </div>

        {/* Selected Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm font-medium text-neutral-dark mr-2 py-1">Selected Filters:</span>
          {['Job Role: Facilities Manager', 'Security Clearance: Top Secret', 'Industry: Tech'].map((filter) => (
            <span key={filter} className="inline-flex items-center bg-green-100 text-primary-dark text-xs px-3 py-1 rounded-full font-medium">
              {filter}
              <button className="ml-2 hover:text-red-500">×</button>
            </span>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-neutral-dark font-medium">{candidates.length} candidates matched</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-gray">Sort by:</span>
            <select className="text-sm font-medium border-none bg-transparent focus:ring-0 cursor-pointer">
              <option>Match Score</option>
              <option>Newest</option>
            </select>
          </div>
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
              <Link to="/signup" className="bg-white border border-neutral-light hover:bg-neutral-light text-neutral-dark font-medium py-2 px-6 rounded-lg transition-colors">
                Sign Up
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
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-light hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <img src={candidate.image} alt={candidate.name} className="w-16 h-16 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-dark">{candidate.name}</h3>
                        <div className="text-sm text-neutral-gray mb-2">
                          {candidate.role} <span className="mx-1">|</span> {candidate.location}
                        </div>
                      </div>
                      <div className="bg-green-100 text-primary-dark font-bold px-3 py-1 rounded text-sm">
                        {candidate.matchScore}% Match
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      {candidate.badges.map((badge, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-dark text-xs px-2 py-1 rounded font-medium">
                          {badge.includes('Clearance') && <ShieldCheck className="w-3 h-3 text-green-600" />}
                          {badge.includes('Veteran') && <Flag className="w-3 h-3 text-blue-600" />}
                          {badge}
                        </span>
                      ))}
                    </div>

                    <p className="text-neutral-gray text-sm mb-4 leading-relaxed">
                      {candidate.summary}
                    </p>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSelectedCandidate(candidate)}
                        className="flex items-center gap-2 px-4 py-2 border border-neutral-light rounded text-sm font-medium text-neutral-dark hover:bg-neutral-50"
                      >
                        <FileText className="w-4 h-4" /> View Resume
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-neutral-light rounded text-sm font-medium text-neutral-dark hover:bg-neutral-50">
                        <Download className="w-4 h-4" /> Download
                      </button>
                      <div className="flex-1"></div>
                      <button 
                        onClick={() => navigate(`/messages?userId=${candidate.id}`, { 
                          state: { 
                            user: {
                              _id: candidate.id,
                              firstName: candidate.name.split(' ')[0],
                              lastName: candidate.name.split(' ').slice(1).join(' '),
                              image: candidate.image,
                              role: 'veteran' // Assuming candidates are veterans
                            }
                          }
                        })}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-primary font-medium rounded text-sm hover:bg-green-100"
                      >
                        <MessageSquare className="w-4 h-4" /> Message
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-primary font-medium rounded text-sm hover:bg-green-100">
                        <Star className="w-4 h-4" /> Save
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded text-sm hover:bg-primary-light">
                        <Eye className="w-4 h-4" /> View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Resume Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-neutral-light sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-neutral-dark">{selectedCandidate.name}</h2>
                <p className="text-neutral-gray">{selectedCandidate.role}</p>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-neutral-gray" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Summary */}
              <section>
                <h3 className="text-lg font-bold text-neutral-dark mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Professional Summary
                </h3>
                <p className="text-neutral-dark leading-relaxed bg-neutral-50 p-4 rounded-lg">
                  {selectedCandidate.summary}
                </p>
              </section>

              {/* Skills */}
              {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-neutral-dark mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {selectedCandidate.experience && selectedCandidate.experience.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-neutral-dark mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" /> Experience
                  </h3>
                  <div className="space-y-4">
                    {selectedCandidate.experience.map((exp, idx) => (
                      <div key={idx} className="border-l-2 border-primary pl-4 py-1">
                        <p className="text-neutral-dark">{exp}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Military History */}
              {selectedCandidate.militaryHistory && (
                <section>
                  <h3 className="text-lg font-bold text-neutral-dark mb-3 flex items-center gap-2">
                    <Flag className="w-5 h-5 text-primary" /> Military Service
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-neutral-gray">Branch</p>
                      <p className="font-medium text-neutral-dark">{selectedCandidate.militaryHistory.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-gray">Rank</p>
                      <p className="font-medium text-neutral-dark">{selectedCandidate.militaryHistory.rank}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-gray">Years of Service</p>
                      <p className="font-medium text-neutral-dark">{selectedCandidate.militaryHistory.yearsOfService} years</p>
                    </div>
                    {selectedCandidate.militaryHistory.securityClearance && (
                      <div>
                        <p className="text-sm text-neutral-gray">Security Clearance</p>
                        <p className="font-medium text-neutral-dark">{selectedCandidate.militaryHistory.securityClearance}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-neutral-light bg-gray-50 flex justify-end gap-3 rounded-b-lg">
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="px-6 py-2 border border-neutral-light rounded-lg font-medium text-neutral-dark hover:bg-white transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  navigate(`/messages?userId=${selectedCandidate.id}`, { 
                    state: { 
                      user: {
                        _id: selectedCandidate.id,
                        firstName: selectedCandidate.name.split(' ')[0],
                        lastName: selectedCandidate.name.split(' ').slice(1).join(' '),
                        image: selectedCandidate.image,
                        role: 'veteran'
                      }
                    }
                  });
                }}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" /> Message Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
