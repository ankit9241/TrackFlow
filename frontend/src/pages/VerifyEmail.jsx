import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/api';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');

    useEffect(() => {
        const verify = async () => {
            try {
                await api.get(`/auth/verifyemail/${token}`);
                setStatus('success');
                toast.success('Email verified successfully!');
            } catch (error) {
                setStatus('error');
                toast.error(error.response?.data?.message || 'Verification failed');
            }
        };

        if (token) {
            verify();
        }
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto w-full bg-white p-10 rounded-3xl border border-gray-100 shadow-xl text-center">
                {status === 'verifying' && (
                    <div className="space-y-6">
                        <ArrowPathIcon className="w-16 h-16 text-teal-600 animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-900">Verifying your email...</h2>
                        <p className="text-gray-500">Please wait while we confirm your activation code.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
                        <p className="text-gray-500">Your account is now active. You can now access all premium features.</p>
                        <Link
                            to="/login"
                            className="inline-block w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
                        <p className="text-gray-500">The link might be invalid or expired. Please request a new verification email.</p>
                        <div className="space-y-3">
                            <Link
                                to="/register"
                                className="inline-block w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all"
                            >
                                Back to Register
                            </Link>
                            <Link
                                to="/"
                                className="inline-block w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-all"
                            >
                                Go Home
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
