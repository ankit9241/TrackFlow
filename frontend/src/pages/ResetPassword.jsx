import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  LockClosedIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import api from '../api/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.put(
        `/auth/resetpassword/${token}`,
        { password }
      );
      toast.success('Password updated');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-10 pb-8 border-b border-slate-100 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Create new password
            </h1>
            <p className="text-sm text-slate-600">
              Choose a strong password to secure your account.
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">
                  New password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Action */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm disabled:opacity-50"
              >
                {loading ? 'Updating…' : 'Reset password'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;