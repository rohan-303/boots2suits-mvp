import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/user';
import { 
  User, 
  Mail, 
  Briefcase, 
  Award, 
  Target, 
  Edit2, 
  Save, 
  X,
  Shield,
  Clock
} from 'lucide-react';

export const VeteranProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    militaryBranch: user?.militaryBranch || '',
    persona: {
      role: user?.persona?.role || '',
      yearsOfService: user?.persona?.yearsOfService || '',
      skills: user?.persona?.skills?.join(', ') || '', // Display as comma-separated string
      goals: user?.persona?.goals || '',
      bio: user?.persona?.bio || ''
    }
  });

  if (!user) return <div>Loading...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('persona.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        persona: {
          ...prev.persona,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Convert comma-separated skills back to array
      const updatedProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        militaryBranch: formData.militaryBranch,
        persona: {
          ...formData.persona,
          skills: formData.persona.skills.split(',').map(s => s.trim()).filter(Boolean)
        }
      };

      const updatedUser = await updateProfile(updatedProfile);
      updateUser(updatedUser);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      militaryBranch: user.militaryBranch || '',
      persona: {
        role: user.persona?.role || '',
        yearsOfService: user.persona?.yearsOfService || '',
        skills: user.persona?.skills?.join(', ') || '',
        goals: user.persona?.goals || '',
        bio: user.persona?.bio || ''
      }
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden mb-8">
        <div className="h-32 bg-primary/10 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 bg-white rounded-full p-1 border-4 border-white shadow-md flex items-center justify-center">
              <User size={64} className="text-neutral-400" />
            </div>
          </div>
          <div className="absolute top-4 right-4">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium hover:bg-neutral-50 transition-colors"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        <div className="pt-20 pb-8 px-8">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Military Branch</label>
                <select
                  name="militaryBranch"
                  value={formData.militaryBranch}
                  onChange={handleChange as any}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Branch</option>
                  <option value="Army">Army</option>
                  <option value="Navy">Navy</option>
                  <option value="Air Force">Air Force</option>
                  <option value="Marines">Marines</option>
                  <option value="Coast Guard">Coast Guard</option>
                  <option value="Space Force">Space Force</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{user.firstName} {user.lastName}</h1>
              <div className="flex items-center gap-4 mt-2 text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <Mail size={16} />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield size={16} />
                  {user.militaryBranch}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Main Content Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Military Service */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Briefcase className="text-primary" size={20} />
              Military Background
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Role / Title</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="persona.role"
                    value={formData.persona.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g. Platoon Sergeant"
                  />
                ) : (
                  <p className="text-neutral-900">{user.persona?.role || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Years of Service</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="persona.yearsOfService"
                    value={formData.persona.yearsOfService}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g. 8"
                  />
                ) : (
                  <p className="text-neutral-900 flex items-center gap-2">
                    <Clock size={16} className="text-neutral-400" />
                    {user.persona?.yearsOfService ? `${user.persona.yearsOfService} Years` : 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Target className="text-primary" size={20} />
              Career Goals
            </h2>
            {isEditing ? (
              <textarea
                name="persona.goals"
                value={formData.persona.goals}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="What are your civilian career goals?"
              />
            ) : (
              <p className="text-neutral-600 leading-relaxed">
                {user.persona?.goals || 'No career goals specified yet.'}
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Skills & Bio */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Award className="text-primary" size={20} />
              Skills
            </h2>
            {isEditing ? (
              <div>
                <p className="text-xs text-neutral-500 mb-2">Separate skills with commas</p>
                <textarea
                  name="persona.skills"
                  value={formData.persona.skills}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Leadership, Logistics, Project Management..."
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.persona?.skills && user.persona.skills.length > 0 ? (
                  user.persona.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-neutral-500 text-sm">No skills added yet.</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Bio</h2>
            {isEditing ? (
              <textarea
                name="persona.bio"
                value={formData.persona.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tell us a bit about yourself..."
              />
            ) : (
              <p className="text-neutral-600 text-sm leading-relaxed">
                {user.persona?.bio || 'No bio available.'}
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="lg:col-span-3 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-2 px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
              disabled={loading}
            >
              <X size={18} />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
