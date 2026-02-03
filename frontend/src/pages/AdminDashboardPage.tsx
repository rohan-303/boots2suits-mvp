import { useEffect, useState } from 'react';
import { partnerService } from '../services/partnerService';
import { storyService, type Story } from '../services/storyService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Clock, AlertCircle, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface Inquiry {
  _id: string;
  organizationName: string;
  contactName: string;
  email: string;
  type: string;
  message: string;
  status: string;
  createdAt: string;
}

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'partners' | 'stories'>('partners');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simple protection - in production this should be more robust
    if (user && user.role !== 'admin' && user.role !== 'employer') { // Allow employer for now for demo
      // navigate('/');
      // return;
    }

    const fetchInquiries = async () => {
      try {
        const data = await partnerService.getInquiries();
        setInquiries(data);
      } catch (err) {
        console.error('Failed to fetch inquiries:', err);
        setError('Failed to load partnership inquiries.');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'stories') {
      const fetchStories = async () => {
        try {
          const data = await storyService.getStories('pending');
          setStories(data);
        } catch (err) {
          console.error('Failed to fetch stories:', err);
        }
      };
      fetchStories();
    }
  }, [activeTab]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await partnerService.updateStatus(id, newStatus);
      setInquiries(inquiries.map(i => i._id === id ? { ...i, status: newStatus } : i));
    } catch (err) {
      console.error('Failed to update status:', err);
      // Optionally show error toast
    }
  };

  const handleStoryApproval = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await storyService.updateStatus(id, status);
      setStories(stories.filter(s => s._id !== id));
    } catch (err) {
      console.error('Failed to update story status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-light/30">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark font-cinzel">Admin Dashboard</h1>
          <p className="text-neutral-gray mt-1">Manage partnership inquiries and success stories.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-neutral-light">
          <button
            onClick={() => setActiveTab('partners')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'partners'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-gray hover:text-neutral-dark'
            }`}
          >
            Partnership Inquiries
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'stories'
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-gray hover:text-neutral-dark'
            }`}
          >
            Pending Stories
            {stories.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                {stories.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'partners' ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-light overflow-hidden">
            <div className="p-6 border-b border-neutral-light flex justify-between items-center">
              <h2 className="text-xl font-bold text-neutral-dark flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Partnership Inquiries
              </h2>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {inquiries.length} Requests
              </span>
            </div>

            {error ? (
              <div className="p-8 text-center text-red-600">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                {error}
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-12 text-center text-neutral-gray">
                <p>No partnership inquiries yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-neutral-light/50 text-neutral-gray text-sm uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Organization</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Partnership Interest</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-light">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry._id} className="hover:bg-neutral-light/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-dark">{inquiry.organizationName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-neutral-dark font-medium">{inquiry.contactName}</span>
                            <span className="text-sm text-neutral-gray flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {inquiry.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                            {inquiry.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 min-w-80">
                          <p className="text-sm text-neutral-gray whitespace-pre-wrap">
                            {inquiry.message}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-neutral-gray text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                            className={`block w-full pl-3 pr-8 py-1 text-xs font-medium rounded-full border-none focus:ring-0 cursor-pointer appearance-none
                              ${inquiry.status === 'new' ? 'bg-green-50 text-green-700' : 
                                inquiry.status === 'contacted' ? 'bg-blue-50 text-blue-700' :
                                inquiry.status === 'partnered' ? 'bg-purple-50 text-purple-700' :
                                'bg-gray-100 text-gray-800'
                              }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="partnered">Partnered</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-light overflow-hidden">
            <div className="p-6 border-b border-neutral-light flex justify-between items-center">
              <h2 className="text-xl font-bold text-neutral-dark flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Pending Success Stories
              </h2>
            </div>

            {stories.length === 0 ? (
              <div className="p-12 text-center text-neutral-gray">
                <p>No pending stories to review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-neutral-light/50 text-neutral-gray text-sm uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Veteran</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Story Content</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-light">
                    {stories.map((story) => (
                      <tr key={story._id} className="hover:bg-neutral-light/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-dark">
                            {story.user.firstName} {story.user.lastName}
                          </div>
                          <div className="text-xs text-neutral-gray">
                            {story.militaryBranch} • {story.currentRole}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-neutral-dark">
                          {story.title}
                        </td>
                        <td className="px-6 py-4 min-w-96">
                          <p className="text-sm text-neutral-gray whitespace-pre-wrap max-h-32 overflow-y-auto">
                            {story.content}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-neutral-gray text-sm">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStoryApproval(story._id, 'approved')}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleStoryApproval(story._id, 'rejected')}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
