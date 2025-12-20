import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../api/api';
import {
  UserIcon,
  LockClosedIcon,
  TrashIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { currentUser, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((p) => ({
        ...p,
        email: currentUser.email || '',
        name: currentUser.name || '',
        bio: currentUser.bio || '',
      }));
    }
  }, [currentUser]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.put('/auth/profile', {
        name: formData.name,
        bio: formData.bio,
      });
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.currentPassword) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.put('/auth/update-email', {
        email: formData.email,
        password: formData.currentPassword,
      });
      updateUser(response.data.user);
      toast.success('Email updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error('Please fill all fields');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setIsLoading(true);
      await api.put('/auth/update-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Password updated');
      setFormData((p) => ({
        ...p,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await api.delete('/auth/account');
      toast.success('Account deleted');
      logout();
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: IdentificationIcon },
    { id: 'security', name: 'Security', icon: LockClosedIcon },
  ];

  return (
    <div className="min-h-screen bg-teal-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-600">
            Manage your account and security preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar */}
          <aside className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-white'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>

            <div className="mt-10 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <TrashIcon className="w-4 h-4" />
                Delete account
              </button>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1">

            {activeTab === 'profile' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <IdentificationIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Profile Details
                    </h2>
                    <p className="text-sm text-slate-600">
                      How you appear to others
                    </p>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      rows="4"
                      placeholder="Tell us a bit about yourself..."
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    />
                    <p className="mt-2 text-[11px] text-slate-400">
                      Brief description for your profile. Maximum 160 characters.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-100 disabled:opacity-50"
                  >
                    <CloudArrowUpIcon className="w-4 h-4" />
                    {isLoading ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              </div>
            )}


            {activeTab === 'security' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Security
                    </h2>
                    <p className="text-sm text-slate-600">
                      Update your login password
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Current password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-100 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Account</h3>
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">
              This action is <span className="font-semibold text-red-600">permanent and cannot be undone</span>.
              All your habits, progress data, and account information will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
