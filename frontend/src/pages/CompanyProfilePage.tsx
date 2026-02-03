import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/user';
import { Building, MapPin, Globe, Users, FileText, Save, ArrowLeft, Briefcase } from 'lucide-react';

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function CompanyProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    companyDescription: user?.companyDescription || '',
    companyWebsite: user?.companyWebsite || '',
    companyLocation: user?.companyLocation || '',
    companyIndustry: user?.companyIndustry || '',
    companySize: user?.companySize || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);
      setSuccess('Company profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-neutral-gray hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-neutral-light overflow-hidden">
          <div className="bg-primary/5 p-6 border-b border-neutral-light">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Building className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark font-cinzel">Company Profile</h1>
                <p className="text-sm text-neutral-gray">Update your company information and branding.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building className="w-4 h-4 text-primary" />
                    Company Name
                  </div>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    Headquarters Location
                  </div>
                </label>
                <input
                  type="text"
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  placeholder="e.g. New York, NY"
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-primary" />
                    Website
                  </div>
                </label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Industry
                  </div>
                </label>
                <select
                  name="companyIndustry"
                  value={formData.companyIndustry}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Defense">Defense & Aerospace</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Government">Government</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    Company Size
                  </div>
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-500">201-500 Employees</option>
                  <option value="500+">500+ Employees</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-primary" />
                    About Company
                  </div>
                </label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell veterans about your mission, culture, and why they should join you..."
                  className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-4 border-t border-neutral-light">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-neutral-light rounded-lg hover:bg-neutral-light/50 transition-colors text-neutral-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-md shadow-primary/20 disabled:opacity-70 flex items-center gap-2"
              >
                {loading ? 'Saving...' : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}