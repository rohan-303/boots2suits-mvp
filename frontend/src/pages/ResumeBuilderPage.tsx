import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createResume, getMyResume, parseDocument } from '../services/resume';
import type { ResumeData, MilitaryHistory } from '../services/resume';
import { Shield, ChevronRight, CheckCircle, Loader2, FileText, Briefcase, Award, Upload, AlertCircle } from 'lucide-react';

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const ResumeBuilderPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Form State
  const [formData, setFormData] = useState<MilitaryHistory>({
    branch: user?.militaryBranch || 'Army',
    rank: '',
    mosCode: '',
    yearsOfService: 0,
    securityClearance: 'None',
    leadershipRole: '',
    awards: '',
    description: ''
  });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await getMyResume();
      if (response && response.success) {
        setResume(response.data);
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setError('');
      setUploadSuccess('');

      try {
        const response = await parseDocument(file);
        if (response.success) {
          setFormData({
            ...formData,
            ...response.data,
            // Keep yearsOfService if 0 or undefined returned
            yearsOfService: response.data.yearsOfService || formData.yearsOfService
          });
          setUploadSuccess('Document analyzed! Form populated with extracted data.');
        }
      } catch (err: unknown) {
        console.error('Upload error:', err);
        const error = err as ApiError;
        const backendMessage = error.response?.data?.message || error.message;
        setError(backendMessage ? `Failed: ${backendMessage}` : 'Failed to analyze document. Please enter details manually.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await createResume(formData);
      setResume(response.data);
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || 'Failed to generate resume');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#4A5D23] animate-spin" />
      </div>
    );
  }

  if (loading && !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#4A5D23] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#4A5D23] font-condensed uppercase tracking-wide">
            Military Translator
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Convert your service history into a civilian resume instantly.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md animate-fade-in">
             <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-700">{uploadSuccess}</p>
            </div>
          </div>
        )}

        {!resume ? (
          // Input Form
          <div className="bg-white shadow-xl rounded-lg overflow-hidden border-t-4 border-[#C5A059]">
            <div className="p-8">
              
              {/* File Upload Section */}
              <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center hover:bg-gray-100 transition-colors">
                 <div className="flex flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Auto-Fill from Documents</h3>
                    <p className="text-sm text-gray-500 mb-4">Upload your VMET, DD-214 (Redacted), or Old Resume (PDF/TXT)</p>
                    
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A5D23]">
                        {uploading ? (
                          <>
                           <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                           Analyzing...
                          </>
                        ) : 'Select File to Upload'}
                      </span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.txt" 
                        onChange={handleFileUpload} 
                        disabled={uploading}
                      />
                    </label>
                 </div>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-sm text-gray-500">Or enter details manually</span>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-[#4A5D23] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Service Details</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Branch of Service</label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#4A5D23] focus:border-[#4A5D23] sm:text-sm rounded-md border"
                    >
                      <option value="Army">Army</option>
                      <option value="Navy">Navy</option>
                      <option value="Air Force">Air Force</option>
                      <option value="Marines">Marines</option>
                      <option value="Coast Guard">Coast Guard</option>
                      <option value="Space Force">Space Force</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rank / Pay Grade</label>
                    <input
                      type="text"
                      name="rank"
                      required
                      placeholder="e.g. Sergeant / E-5"
                      value={formData.rank}
                      onChange={handleChange}
                      className="mt-1 focus:ring-[#4A5D23] focus:border-[#4A5D23] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">MOS / AFSC / Rating Code</label>
                    <input
                      type="text"
                      name="mosCode"
                      required
                      placeholder="e.g. 11B, 25U"
                      value={formData.mosCode}
                      onChange={handleChange}
                      className="mt-1 focus:ring-[#4A5D23] focus:border-[#4A5D23] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Years of Service</label>
                    <input
                      type="number"
                      name="yearsOfService"
                      required
                      min="0"
                      value={formData.yearsOfService}
                      onChange={handleChange}
                      className="mt-1 focus:ring-[#4A5D23] focus:border-[#4A5D23] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Security Clearance</label>
                    <select
                      name="securityClearance"
                      value={formData.securityClearance}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#4A5D23] focus:border-[#4A5D23] sm:text-sm rounded-md border"
                    >
                      <option value="None">None / Expired</option>
                      <option value="Secret">Secret</option>
                      <option value="Top Secret">Top Secret</option>
                      <option value="Top Secret (TS/SCI)">Top Secret (TS/SCI)</option>
                      <option value="Public Trust">Public Trust</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Highest Leadership Role</label>
                    <input
                      type="text"
                      name="leadershipRole"
                      value={formData.leadershipRole || ''}
                      onChange={handleChange}
                      placeholder="e.g. Squad Leader, Platoon Sergeant, OIC"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A5D23] focus:border-[#4A5D23] sm:text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Awards & Honors</label>
                    <input
                      type="text"
                      name="awards"
                      value={formData.awards || ''}
                      onChange={handleChange}
                      placeholder="e.g. Bronze Star, Commendation Medal, Achievement Medal"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#4A5D23] focus:border-[#4A5D23] sm:text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Service Description / Achievements</label>
                  <p className="text-xs text-gray-500 mb-2">Briefly list any major accomplishments or specific duties.</p>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-[#4A5D23] focus:border-[#4A5D23] block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                    placeholder="Led a squad of 12 personnel..."
                  />
                </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#4A5D23] hover:bg-[#3b4a1c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A5D23]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Translating...
                      </>
                    ) : (
                      <>
                        Translate to Civilian <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          // Results View
          <div className="space-y-8 animate-slide-up">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
               <h2 className="text-xl font-bold text-gray-800">Your Translated Profile</h2>
               <button 
                 onClick={() => setResume(null)}
                 className="text-[#4A5D23] font-medium hover:text-[#3b4a1c]"
               >
                 Edit / Regenerate
               </button>
            </div>

            {/* Summary */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border-l-4 border-[#C5A059]">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-[#C5A059] mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Professional Summary</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {resume.generatedSummary}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skills */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Award className="h-6 w-6 text-[#4A5D23] mr-2" />
                    <h3 className="text-lg font-bold text-gray-900">Transferred Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resume.generatedSkills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#4A5D23]/10 text-[#4A5D23]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Briefcase className="h-6 w-6 text-[#4A5D23] mr-2" />
                    <h3 className="text-lg font-bold text-gray-900">Civilian Experience Mapping</h3>
                  </div>
                  <ul className="space-y-3">
                    {resume.generatedExperience.map((exp, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#C5A059] mr-2 mt-0.5 shrink-0" />
                        <span className="text-gray-700 text-sm">{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
             <div className="flex justify-center mt-8">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  &larr; Back to Dashboard
                </button>
              </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
