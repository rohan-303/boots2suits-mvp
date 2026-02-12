import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createCompany, getCompanies, joinCompany, type Company } from '../services/companyService';
import { Building2, Search, ArrowRight, User, Briefcase, Globe, MapPin } from 'lucide-react';

export function EmployerOnboardingPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Employer Details (Mock - usually we might update user profile here)
  const [employerDetails, setEmployerDetails] = useState({
    title: '',
    department: '',
    phone: ''
  });

  // Step 2: Company Search/Create
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  
  // New Company Form
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    website: '',
    location: '',
    size: '1-10',
    description: ''
  });

  useEffect(() => {
    // If user already has a company, redirect to dashboard
    if (user?.companyId) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (searchTerm.length > 2) {
        try {
          const results = await getCompanies(searchTerm);
          setCompanies(results);
        } catch (err) {
          console.error(err);
        }
      } else {
        setCompanies([]);
      }
    };
    
    const debounce = setTimeout(fetchCompanies, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleJoinCompany = async () => {
    if (!selectedCompany) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await joinCompany(selectedCompany._id);
      
      if (response.user) {
         updateUser(response.user);
         navigate('/dashboard');
      } else {
         navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join company');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await createCompany(newCompany);
      // Create company response now returns { company, user } (if we updated the backend)
      if (response.user) {
         updateUser(response.user);
         navigate('/dashboard');
      } else {
         navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create company');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-neutral-dark font-heading">
          {step === 1 ? 'Tell us about yourself' : 'Join your Company'}
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-gray">
          {step === 1 ? 'Help us personalize your experience' : 'Find your company or create a new profile'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          
          {/* Step 1: Employer Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-dark">Job Title</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={employerDetails.title}
                    onChange={(e) => setEmployerDetails({...employerDetails, title: e.target.value})}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="e.g. HR Manager"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark">Department</label>
                <input
                  type="text"
                  value={employerDetails.department}
                  onChange={(e) => setEmployerDetails({...employerDetails, department: e.target.value})}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="e.g. Talent Acquisition"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!employerDetails.title}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2: Company Selection */}
          {step === 2 && !isCreatingCompany && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-dark">Search Company</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedCompany(null);
                    }}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Search by company name..."
                  />
                </div>
              </div>

              {/* Search Results */}
              {companies.length > 0 && !selectedCompany && (
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                  {companies.map(company => (
                    <button
                      key={company._id}
                      onClick={() => setSelectedCompany(company)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center gap-3"
                    >
                      <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center shrink-0">
                        {company.logo ? (
                          <img src={company.logo} alt="" className="h-8 w-8 rounded object-cover" />
                        ) : (
                          <Building2 className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-neutral-dark">{company.name}</p>
                        <p className="text-xs text-neutral-gray">{company.industry} • {company.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Company Preview */}
              {selectedCompany && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-4">
                  <div className="h-12 w-12 rounded bg-white flex items-center justify-center shrink-0 shadow-sm">
                    {selectedCompany.logo ? (
                      <img src={selectedCompany.logo} alt="" className="h-12 w-12 rounded object-cover" />
                    ) : (
                      <Building2 className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-dark">{selectedCompany.name}</h3>
                    <p className="text-sm text-neutral-gray">{selectedCompany.industry}</p>
                    <p className="text-xs text-neutral-gray mt-1">{selectedCompany.description?.substring(0, 100)}...</p>
                  </div>
                  <button 
                    onClick={() => setSelectedCompany(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {selectedCompany ? (
                <button
                  onClick={handleJoinCompany}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {isLoading ? 'Joining...' : `Join ${selectedCompany.name}`}
                </button>
              ) : (
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-neutral-gray mb-3">Can't find your company?</p>
                  <button
                    onClick={() => {
                      setIsCreatingCompany(true);
                      setNewCompany(prev => ({ ...prev, name: searchTerm }));
                    }}
                    className="text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    Create a new Company Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2b: Create Company Form */}
          {step === 2 && isCreatingCompany && (
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark">Industry</label>
                <select
                  required
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Defense">Defense</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark">Website</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={newCompany.website}
                    onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark">Headquarters Location</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={newCompany.location}
                    onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark">Company Size</label>
                <select
                  value={newCompany.size}
                  onChange={(e) => setNewCompany({...newCompany, size: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark">Description</label>
                <textarea
                  rows={3}
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Brief description of your company..."
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreatingCompany(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Company'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
