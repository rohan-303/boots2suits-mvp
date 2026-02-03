import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, MessageSquare, Trash2, Flag, ShieldCheck, Star, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSavedCandidates, unsaveCandidate } from '../services/user';

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  militaryBranch: string;
  location: string;
  resume?: {
    title: string;
    summary: string;
    skills: string[];
    experience: string[];
    militaryHistory?: {
      branch: string;
      rank: string;
      yearsOfService: number;
      securityClearance?: string;
    };
  };
}

export const SavedCandidatesPage: React.FC = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const fetchSavedCandidates = async () => {
      try {
        const data = await getSavedCandidates();
        setCandidates(data);
      } catch (err) {
        console.error('Error fetching saved candidates:', err);
        setError('Failed to load saved candidates.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'employer') {
      fetchSavedCandidates();
    }
  }, [user]);

  const handleUnsave = async (candidateId: string) => {
      try {
          await unsaveCandidate(candidateId);
          setCandidates(candidates.filter(c => c._id !== candidateId));
      } catch (error) {
          console.error('Error unsaving candidate:', error);
      }
  };

  if (user?.role !== 'employer') {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="p-8 text-center text-neutral-gray">
                <div className="w-16 h-16 bg-neutral-light/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-neutral-gray" />
                </div>
                <h2 className="text-xl font-bold text-neutral-dark mb-2">Saved Jobs Coming Soon</h2>
                <p className="text-neutral-gray">This feature is currently under development for veterans.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark">Saved Candidates</h1>
        <p className="text-neutral-gray mt-2">Manage your shortlisted veteran talent</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-neutral-light shadow-sm">
          <div className="w-16 h-16 bg-neutral-light/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-neutral-gray" />
          </div>
          <h2 className="text-xl font-bold text-neutral-dark mb-2">No Saved Candidates</h2>
          <p className="text-neutral-gray mb-6">Start browsing candidates and save the best matches here.</p>
          <Link to="/candidates" className="bg-primary hover:bg-primary-light text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Browse Candidates
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div key={candidate._id} className="bg-white rounded-lg border border-neutral-light p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-6">
                <img 
                  src={`https://ui-avatars.com/api/?name=${candidate.firstName}+${candidate.lastName}&background=random`} 
                  alt={`${candidate.firstName} ${candidate.lastName}`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-dark">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <p className="text-primary font-medium flex items-center gap-1">
                        {candidate.resume?.title || 'Veteran Candidate'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-sm text-neutral-gray flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {candidate.resume?.militaryHistory?.yearsOfService || 0} Years Service
                       </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                      <Flag className="w-3 h-3" /> {candidate.militaryBranch || 'Veteran'}
                    </span>
                    {candidate.resume?.militaryHistory?.securityClearance && (
                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs font-medium">
                            <ShieldCheck className="w-3 h-3" /> {candidate.resume.militaryHistory.securityClearance}
                         </span>
                    )}
                    {candidate.resume?.skills?.slice(0, 3).map(skill => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                            {skill}
                        </span>
                    ))}
                  </div>

                  <p className="text-neutral-gray text-sm mb-4 line-clamp-2">
                    {candidate.resume?.summary || 'No summary available.'}
                  </p>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedCandidate(candidate)}
                      className="flex items-center gap-2 px-4 py-2 border border-neutral-light rounded text-sm font-medium text-neutral-dark hover:bg-neutral-50"
                    >
                      <FileText className="w-4 h-4" /> View Resume
                    </button>
                    <div className="flex-1"></div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-primary font-medium rounded text-sm hover:bg-green-100">
                      <MessageSquare className="w-4 h-4" /> Message
                    </button>
                    <button 
                        onClick={() => handleUnsave(candidate._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-medium rounded text-sm hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resume Modal - Reused from CandidatesPage logic */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-neutral-light sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-neutral-dark">{selectedCandidate.firstName} {selectedCandidate.lastName}</h2>
                <p className="text-neutral-gray">{selectedCandidate.resume?.title}</p>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Summary */}
              <section>
                <h3 className="text-lg font-bold text-neutral-dark mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Professional Summary
                </h3>
                <p className="text-neutral-dark leading-relaxed bg-neutral-50 p-4 rounded-lg">
                  {selectedCandidate.resume?.summary}
                </p>
              </section>

              {/* Skills */}
              {selectedCandidate.resume?.skills && selectedCandidate.resume.skills.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-neutral-dark mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.resume.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {selectedCandidate.resume?.experience && selectedCandidate.resume.experience.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-neutral-dark mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" /> Experience
                  </h3>
                  <div className="space-y-4">
                    {selectedCandidate.resume.experience.map((exp, idx) => (
                      <div key={idx} className="border-l-2 border-primary pl-4 py-1">
                        <p className="text-neutral-dark">{exp}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Military History */}
              {selectedCandidate.resume?.militaryHistory && (
                <section>
                  <h3 className="text-lg font-bold text-neutral-dark mb-3 flex items-center gap-2">
                    <Flag className="w-5 h-5 text-primary" /> Military Service
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-neutral-gray">Branch</p>
                      <p className="font-medium text-neutral-dark">{selectedCandidate.resume.militaryHistory.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-gray">Rank</p>
                      <p className="font-medium text-neutral-dark">{selectedCandidate.resume.militaryHistory.rank}</p>
                    </div>
                     <div>
                      <p className="text-sm text-neutral-gray">Years of Service</p>
                      <p className="font-medium text-neutral-dark">{selectedCandidate.resume.militaryHistory.yearsOfService}</p>
                    </div>
                    {selectedCandidate.resume.militaryHistory.securityClearance && (
                        <div>
                        <p className="text-sm text-neutral-gray">Security Clearance</p>
                        <p className="font-medium text-neutral-dark">{selectedCandidate.resume.militaryHistory.securityClearance}</p>
                        </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            <div className="p-6 border-t border-neutral-light flex justify-end gap-4 sticky bottom-0 bg-white">
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 border border-neutral-light rounded text-sm font-medium text-neutral-dark hover:bg-white"
              >
                Close
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded text-sm hover:bg-primary-light">
                <MessageSquare className="w-4 h-4" /> Contact Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedCandidatesPage;
