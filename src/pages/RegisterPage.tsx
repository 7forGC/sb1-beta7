import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon } from '../components/LogoIcon';
import { Loader2, AlertCircle, Mail, Heart } from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';

export const RegisterPage = () => {
  const { signUp, signInWithGoogle, signInWithFacebook, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.name);
      setVerificationEmailSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (verificationEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <strong>{formData.email}</strong>. 
              Please check your inbox and click the link to verify your email address.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = 'https://gmail.com'}
                className="w-full px-4 py-3 bg-gradient-custom text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Open Gmail
              </button>
              <Link
                to="/login"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800">
      <nav className="bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <LogoIcon className="h-8 w-8 text-white" />
              <span className="text-white font-semibold text-xl">7 for all GC</span>
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <LogoIcon className="h-12 w-12 mx-auto text-purple-600" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join our community today</p>
        </div>

        {(error || authError) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-custom text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => signInWithGoogle()}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5 mr-2" />
              Google
            </button>

            <button
              onClick={() => signInWithFacebook()}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="h-5 w-5 mr-2" />
              Facebook
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
            Sign in
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <button
              onClick={() => window.open('https://donate.stripe.com/test_donation', '_blank')}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors group"
            >
              <Heart className="h-5 w-5 animate-heartbeat text-pink-500 fill-pink-500" />
              <span>Support Our Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};