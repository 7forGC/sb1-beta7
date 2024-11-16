import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon } from '../components/LogoIcon';
import { Loader2, AlertCircle, Eye, EyeOff, Heart, Globe } from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';

export const LoginPage = () => {
  const { signIn, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load saved email if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      
      // Handle "Remember Me"
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      navigate('/messages');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800">
      <nav className="bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <LogoIcon className="h-8 w-8 text-white" />
              <span className="text-white font-semibold text-xl">7 for all GC</span>
            </Link>
            <LanguageSelector white />
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <LogoIcon className="h-12 w-12 mx-auto text-purple-600" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {/* Language Selection Banner */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Choose your language</span>
            </div>
            <LanguageSelector />
          </div>
        </div>

        {(error || authError) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
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
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-purple-600 hover:text-purple-500"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-custom text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
            Sign up
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