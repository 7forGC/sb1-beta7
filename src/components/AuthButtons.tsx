import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { AlertCircle } from 'lucide-react';

export const AuthButtons = () => {
  const { signInWithGoogle, signInWithFacebook, signInAsGuest, error } = useAuth();

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <Button
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      >
        <img src="/google.svg" alt="Google" className="w-5 h-5" />
        Continue with Google
      </Button>

      <Button
        onClick={signInWithFacebook}
        className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white hover:bg-[#1865F2]"
      >
        <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
        Continue with Facebook
      </Button>

      <Button
        onClick={signInAsGuest}
        className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white hover:bg-gray-700"
      >
        Continue as Guest
        <span className="text-xs text-gray-300">(3 visits/day per IP)</span>
      </Button>

      <p className="text-xs text-gray-500 text-center mt-2">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};