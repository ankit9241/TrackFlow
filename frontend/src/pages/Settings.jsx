import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  UserIcon,
  LockClosedIcon,
  TrashIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((p) => ({ ...p, email: currentUser.email || '' }));
    }
  }, [currentUser]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.currentPassword) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      setIsLoading(true);
      await axios.put('/auth/update-email', {
        email: formData.email,
        password: formData.currentPassword,
      });
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
      await axios.put('/auth/update-password', {
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
    if (!window.confirm('This will permanently delete your account. Continue?')) return;
    try {
      setIsLoading(true);
      await axios.delete('/auth/account');
      toast.success('Account deleted');
      logout();
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: UserIcon },
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
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                    activeTab === tab.id
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
                onClick={handleDeleteAccount}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <TrashIcon className="w-4 h-4" />
                Delete account
              </button>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1">

            {activeTab === 'account' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <EnvelopeIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Email address
                    </h2>
                    <p className="text-sm text-slate-600">
                      Used for login and notifications
                    </p>
                  </div>
                </div>

                <form onSubmit={handleEmailUpdate} className="space-y-6">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm"
                  />
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl"
                  >
                    Update email
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Change password
                    </h2>
                    <p className="text-sm text-slate-600">
                      Keep your account secure
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl"
                  >
                    Update password
                  </button>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
