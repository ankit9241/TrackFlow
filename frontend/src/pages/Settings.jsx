import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || ''
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.currentPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await axios.put('/auth/update-email', {
        email: formData.email,
        password: formData.currentPassword
      });
      toast.success('Email updated successfully');
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error(error.response?.data?.message || 'Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword || !formData.currentPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await axios.put('/auth/update-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast.success('Password updated successfully');
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '', currentPassword: '' }));
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        await axios.delete('/auth/account');
        toast.success('Account deleted successfully');
        logout();
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Update Email */}
        <div className="pt-8">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Email Address</h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your email address
              </p>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form onSubmit={handleEmailUpdate}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="current-password-email" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="current-password-email"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Enter your current password"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update Email'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Update Password */}
        <div className="pt-8">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your password
              </p>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form onSubmit={handlePasswordUpdate}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="current-password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Enter your current password"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="new-password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirm-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="pt-8">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Delete Account</h3>
              <p className="mt-1 text-sm text-gray-500">
                Permanently delete your account
              </p>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Delete your account</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Once you delete your account, you will lose all your data including your habits and tracking history. This action cannot be undone.
                    </p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isLoading ? 'Deleting...' : 'Delete Account'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;