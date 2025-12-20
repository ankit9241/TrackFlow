import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import {
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Please check your email and verify your account.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">

          {/* Context Header */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">
              Join Track<span className="text-emerald-600">Flow</span>
            </h1>
            <p className="text-sm text-slate-600 text-center">
              Start building consistent habits today.
            </p>
          </div>

          {/* Form Area */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full pl-10 pr-4 py-2.5 bg-teal-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
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
                  <ShieldCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="font-medium text-slate-900">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-medium text-slate-900">
                    Privacy Policy
                  </Link>.
                </label>
              </div>

              {/* Action */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm disabled:opacity-50"
              >
                {isLoading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-slate-900">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
