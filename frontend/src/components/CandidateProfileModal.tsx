import { useNavigate } from 'react-router-dom';
import { X, Briefcase, Flag, ShieldCheck, MessageSquare, Download, GraduationCap } from 'lucide-react';

interface ResumeExperience {
  title?: string;
  company?: string;
  date?: string;
  description?: string;
}

interface ResumeEducation {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
  graduationYear?: string;
  year?: string;
}

interface ResumeData {
  summary?: string;
  skills?: string[];
  experience?: ResumeExperience[];
  education?: ResumeEducation[];
  militaryHistory?: {
    branch?: string;
    rank?: string;
    yearsOfService?: string;
    securityClearance?: string;
  };
  fileUrl?: string;
}

export interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  militaryBranch?: string;
  location?: string;
  role?: string;
  resume?: ResumeData | null;
  persona?: {
    securityClearance?: string;
  };
}

interface CandidateProfileModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export function CandidateProfileModal({ candidate, onClose }: CandidateProfileModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-light p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-neutral-dark">{candidate.firstName} {candidate.lastName}</h2>
            <p className="text-neutral-gray">{candidate.role || 'Veteran'} • {candidate.location || 'USA'}</p>
          </div>
          <div className="flex items-center gap-2">
            {candidate.resume?.fileUrl && (
              <a 
                href={candidate.resume.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <Download className="w-4 h-4" /> Download Resume
              </a>
            )}
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full">
              <X className="w-6 h-6 text-neutral-gray" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Summary */}
          {candidate.resume?.summary && (
            <section>
              <h3 className="text-lg font-bold text-neutral-dark mb-3">Professional Summary</h3>
              <p className="text-neutral-gray leading-relaxed">{candidate.resume.summary}</p>
            </section>
          )}

          {/* Skills */}
          {candidate.resume?.skills && candidate.resume.skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-neutral-dark mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.resume.skills.map((skill, i) => (
                  <span key={i} className="bg-neutral-100 text-neutral-dark px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {candidate.resume?.experience && candidate.resume.experience.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-neutral-dark mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Experience
              </h3>
              <div className="space-y-6">
                {candidate.resume.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-neutral-200">
                    <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary"></div>
                    <h4 className="font-bold text-neutral-dark">{exp.title || 'Role'}</h4>
                    <p className="text-sm text-primary font-medium">{exp.company}</p>
                    <p className="text-sm text-neutral-gray mb-2">{exp.date}</p>
                    <p className="text-neutral-dark text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {candidate.resume?.education && candidate.resume.education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-neutral-dark mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" /> Education
              </h3>
              <div className="space-y-4">
                {candidate.resume.education.map((edu, idx) => (
                  <div key={idx} className="bg-neutral-50 p-4 rounded-lg border border-neutral-light">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-neutral-dark">{edu.school}</h4>
                        <p className="text-primary font-medium">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                      </div>
                      {edu.graduationYear && (
                        <span className="text-sm text-neutral-gray bg-white px-2 py-1 rounded border border-neutral-200">
                          {edu.graduationYear}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Military History */}
          {(candidate.resume?.militaryHistory || candidate.militaryBranch) && (
            <section>
              <h3 className="text-lg font-bold text-neutral-dark mb-3 flex items-center gap-2">
                <Flag className="w-5 h-5 text-primary" /> Military Service
              </h3>
              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-light grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-neutral-gray uppercase tracking-wider mb-1">Branch</p>
                  <p className="font-bold text-neutral-dark">{candidate.resume?.militaryHistory?.branch || candidate.militaryBranch}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-gray uppercase tracking-wider mb-1">Rank</p>
                  <p className="font-bold text-neutral-dark">{candidate.resume?.militaryHistory?.rank || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-gray uppercase tracking-wider mb-1">Years of Service</p>
                  <p className="font-bold text-neutral-dark">{candidate.resume?.militaryHistory?.yearsOfService || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-gray uppercase tracking-wider mb-1">Security Clearance</p>
                  <p className="font-bold text-green-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    {candidate.resume?.militaryHistory?.securityClearance || candidate.persona?.securityClearance || 'None'}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-neutral-light p-6 flex justify-end gap-3 z-10">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-neutral-light rounded-lg font-medium text-neutral-dark hover:bg-gray-50 transition-colors"
          >
            Close
          </button>

          {candidate.resume?.fileUrl && (
            <a 
              href={candidate.resume.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2 border border-neutral-light rounded-lg font-medium text-neutral-dark hover:bg-neutral-50"
            >
              <Download className="w-4 h-4" /> Download Resume
            </a>
          )}

          <button 
            onClick={() => {
              navigate(`/messages?userId=${candidate._id}`, { 
                state: { 
                  user: {
                    _id: candidate._id,
                    firstName: candidate.firstName,
                    lastName: candidate.lastName,
                    role: 'veteran'
                  }
                }
              });
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" /> Message
          </button>
        </div>
      </div>
    </div>
  );
}
