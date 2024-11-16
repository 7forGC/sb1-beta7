import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';

export const AuthPage = () => {
  const { signInWithGoogle, signInWithFacebook, signInAsGuest, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (method: () => Promise<void>) => {
    try {
      await method();
      navigate('/');
    } catch (error) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to 7 for all GC</h2>
          <p className="mt-2 text-sm text-gray-600">Connect with everything that is good</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleSignIn(signInWithGoogle)}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="h-5 w-5 mr-2"
                />
                Continue with Google
              </>
            )}
          </button>

          <button
            onClick={() => handleSignIn(signInWithFacebook)}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <img
                  src="https://www.facebook.com/favicon.ico"
                  alt="Facebook"
                  className="h-5 w-5 mr-2"
                />
                Continue with Facebook
              </>
            )}
          </button>

          <button
            onClick={() => handleSignIn(signInAsGuest)}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Continue as Guest'
            )}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Support Our Project</h3>
            <p className="mt-2 text-sm text-gray-500">
              Help us connect everything that is good by making a donation
            </p>
            <a
              href="https://donate.stripe.com/your-donation-link"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Make a Donation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};