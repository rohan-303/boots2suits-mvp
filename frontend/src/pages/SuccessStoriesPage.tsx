import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storyService, type Story } from '../services/storyService';
import { MessageSquare, Star, Briefcase, Medal, X } from 'lucide-react';

const SuccessStoriesPage: React.FC = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    militaryBranch: '',
    currentRole: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const data = await storyService.getStories();
      setStories(data);
    } catch (err) {
      setError('Failed to load stories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await storyService.createStory(formData);
      // Reset form
      setFormData({ title: '', militaryBranch: '', currentRole: '', content: '' });
      setShowForm(false);
      // Refresh stories
      fetchStories();
    } catch (err) {
      console.error(err);
      alert('Failed to submit story');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Success Stories
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Real stories from veterans who made the transition from boots to suits.
          </p>
          
          {user?.role === 'veteran' && (
            <div className="mt-8">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Share Your Story
              </button>
            </div>
          )}
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : stories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <Star className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Be the First to Share!</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Your journey could be the inspiration another veteran needs to take the next step.
            </p>
            {user?.role === 'veteran' && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Share Your Story
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <div key={story._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {story.user.firstName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{story.user.firstName} {story.user.lastName}</p>
                      <p className="text-xs text-gray-500">{new Date(story.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Medal className="h-4 w-4 mr-1 text-yellow-500" />
                      {story.militaryBranch}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1 text-blue-500" />
                      {story.currentRole}
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-6 whitespace-pre-line">
                    {story.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowForm(false)}></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Share Your Transition Story</h3>
                    <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-500">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Story Title</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., From Sergeant to Software Engineer"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Military Branch</label>
                        <select
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.militaryBranch}
                          onChange={(e) => setFormData({...formData, militaryBranch: e.target.value})}
                        >
                          <option value="">Select Branch</option>
                          <option value="Army">Army</option>
                          <option value="Navy">Navy</option>
                          <option value="Air Force">Air Force</option>
                          <option value="Marines">Marines</option>
                          <option value="Coast Guard">Coast Guard</option>
                          <option value="Space Force">Space Force</option>
                          <option value="Army National Guard">Army National Guard</option>
                          <option value="Air National Guard">Air National Guard</option>
                          <option value="Army Reserve">Army Reserve</option>
                          <option value="Navy Reserve">Navy Reserve</option>
                          <option value="Marine Corps Reserve">Marine Corps Reserve</option>
                          <option value="Air Force Reserve">Air Force Reserve</option>
                          <option value="Coast Guard Reserve">Coast Guard Reserve</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current Role</label>
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="e.g., Product Manager"
                          value={formData.currentRole}
                          onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Your Story</label>
                      <textarea
                        required
                        rows={6}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Share your challenges, victories, and advice for others..."
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                      />
                    </div>

                    <div className="mt-5 sm:mt-6">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                      >
                        {submitting ? 'Submitting...' : 'Post Story'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStoriesPage;
