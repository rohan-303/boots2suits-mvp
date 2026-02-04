import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, type UserProfile } from '../services/userService';
import { Building2, Globe, MapPin, Users, FileText, Edit2, Save, X, Briefcase } from 'lucide-react';

export function CompanyProfilePage() {
  const { user, login } = useAuth(); // login updates the user context
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    website: user?.companyProfile?.website || '',
    industry: user?.companyProfile?.industry || '',
    location: user?.companyProfile?.location || '',
    size: user?.companyProfile?.size || '',
    description: user?.companyProfile?.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: Partial<UserProfile> = {
        companyName: formData.companyName,
        companyProfile: {
          website: formData.website,
          industry: formData.industry,
          location: formData.location,
          size: formData.size,
          description: formData.description,
        }
      };

      const updatedUser = await updateProfile(updateData);
      login(updatedUser); // Update context
      setSuccess('Company profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'employer') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-neutral-dark">Access Denied</h2>
        <p className="text-neutral-gray mt-2">This page is only available for employers.</p>
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-neutral-light overflow-hidden">
        {/* Banner / Header Area */}
        <div className="h-32 bg-linear-to-r from-primary to-accent opacity-90 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-xl shadow-md flex items-center justify-center border-4 border-white">
              <Building2 className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 w-5 h-5 text-neutral-gray" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Industry</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 w-5 h-5 text-neutral-gray" />
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Defense">Defense</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Company Size</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 w-5 h-5 text-neutral-gray" />
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Size</option>
                      <option value="1-10">1-10 Employees</option>
                      <option value="11-50">11-50 Employees</option>
                      <option value="51-200">51-200 Employees</option>
                      <option value="201-500">201-500 Employees</option>
                      <option value="500+">500+ Employees</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Headquarters Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-neutral-gray" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Austin, TX"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-dark mb-1">About Company</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-neutral-gray" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Tell veterans about your company culture and mission..."
                    />
                  </div>
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
                  {isLoading ? 'Saving...' : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-dark">{user.companyName}</h2>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-neutral-gray">
                  {user.companyProfile?.industry && (
                    <span className="flex items-center gap-1 bg-neutral-light/30 px-3 py-1 rounded-full">
                      <Briefcase className="w-4 h-4" /> {user.companyProfile.industry}
                    </span>
                  )}
                  {user.companyProfile?.size && (
                    <span className="flex items-center gap-1 bg-neutral-light/30 px-3 py-1 rounded-full">
                      <Users className="w-4 h-4" /> {user.companyProfile.size}
                    </span>
                  )}
                  {user.companyProfile?.location && (
                    <span className="flex items-center gap-1 bg-neutral-light/30 px-3 py-1 rounded-full">
                      <MapPin className="w-4 h-4" /> {user.companyProfile.location}
                    </span>
                  )}
                  {user.companyProfile?.website && (
                    <a 
                      href={user.companyProfile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline px-3 py-1"
                    >
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-dark mb-3">About Us</h3>
                <p className="text-neutral-gray leading-relaxed whitespace-pre-line">
                  {user.companyProfile?.description || "No description added yet. Click 'Edit Profile' to add details about your company."}
                </p>
              </div>

              {/* Stats Section Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-light">
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-neutral-gray">Active Jobs</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-neutral-gray">Applicants</div>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-neutral-gray">Hires</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
