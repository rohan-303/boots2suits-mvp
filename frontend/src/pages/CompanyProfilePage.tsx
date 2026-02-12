import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCompanyById, updateCompany, type Company } from '../services/companyService';
import { Building2, Globe, MapPin, Users, FileText, Edit2, Save, X } from 'lucide-react';

export function CompanyProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for editing
  const [formData, setFormData] = useState<Partial<Company>>({});

  useEffect(() => {
    const fetchCompany = async () => {
      if (user?.companyId) {
        try {
          const data = await getCompanyById(user.companyId);
          setCompany(data);
          setFormData(data);
        } catch (err) {
          console.error(err);
          setError('Failed to load company profile');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.companyId) return;

    try {
      const updatedCompany = await updateCompany(user.companyId, formData);
      setCompany(updatedCompany);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update company:', err);
      alert('Failed to update company profile');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  if (!user || user.role !== 'employer') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-neutral-dark">Access Denied</h2>
        <p className="text-neutral-gray mt-2">This page is only available for employers.</p>
      </div>
    );
  }

  if (!company) {
     return (
        <div className="p-8 text-center">
           <h2 className="text-2xl font-bold text-neutral-dark">No Company Linked</h2>
           <p className="text-neutral-gray mt-2">Please complete onboarding to link a company.</p>
        </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-dark">Company Profile</h1>
          <p className="text-neutral-gray mt-2">Manage your company's presence and brand.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-light overflow-hidden">
        {/* Header/Banner */}
        <div className="h-32 bg-linear-to-r from-primary to-accent opacity-90 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="h-24 w-24 bg-white rounded-xl border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-12 w-12 text-primary" />
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled // Name change usually requires verification
                  />
                  <p className="text-xs text-neutral-gray mt-1">Contact support to change company name</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 w-5 h-5 text-neutral-gray" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-neutral-gray" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Headquarters location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Company Size</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 w-5 h-5 text-neutral-gray" />
                    <select
                      name="size"
                      value={formData.size || ''}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-neutral-gray" />
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows={5}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell veterans about your company culture and mission..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-light">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 text-neutral-gray hover:text-neutral-dark transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-accent text-primary-dark font-bold rounded-lg hover:bg-accent-light transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-neutral-dark mb-1">{company.name}</h2>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-neutral-gray mb-6">
                <span className="flex items-center gap-1 bg-neutral-light/30 px-3 py-1 rounded-full">
                  <Building2 className="w-4 h-4" /> {company.industry}
                </span>
                <span className="flex items-center gap-1 bg-neutral-light/30 px-3 py-1 rounded-full">
                  <MapPin className="w-4 h-4" /> {company.location || 'Location N/A'}
                </span>
                <span className="flex items-center gap-1 bg-neutral-light/30 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4" /> {company.size || 'Size N/A'}
                </span>
                {company.website && (
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline px-3 py-1"
                    >
                      <Globe className="w-4 h-4" /> Website
                    </a>
                )}
              </div>
              
              <div className="prose max-w-none text-neutral-dark">
                  <h3 className="text-lg font-semibold mb-2">About Us</h3>
                  <p className="whitespace-pre-line">{company.description || 'No description provided.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
