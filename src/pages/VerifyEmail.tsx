import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { LogoIcon } from '../components/LogoIcon';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const oobCode = searchParams.get('oobCode');
      if (!oobCode) {
        setError('Invalid verification link');
        setVerifying(false);
        return;
      }

      try {
        await authService.verifyEmail(oobCode);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <LogoIcon className="h-12 w-12 mx-auto mb-4" />
          
          {verifying ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying your email</h2>
              <Loader2 className="w-8 h-8 mx-auto text-purple-600 animate-spin" />
            </>
          ) : error ? (
            <>
              <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification failed</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-3 bg-gradient-custom text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Back to Login
              </button>
            </>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email verified!</h2>
              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. You will be redirected to the login page shortly.
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-300" style={{ width: '100%' }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};