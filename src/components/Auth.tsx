import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../config/firebase';
import { guestService } from '../services/guestService';
import { useStore } from '../store/useStore';
import { Loader2, Globe, Heart, Coffee, DollarSign, User, Mail } from 'lucide-react';
import { Logo } from './Logo';

export const Auth = () => {
  const navigate = useNavigate();
  const { setLanguage } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLanguages, setShowLanguages] = useState(false);
  const [showDonationDetails, setShowDonationDetails] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/chat');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, facebookProvider);
      navigate('/chat');
    } catch (err) {
      console.error('Facebook sign-in error:', err);
      setError('Failed to sign in with Facebook');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const ip = await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(data => data.ip);
      const canAccess = await guestService.checkGuestLimit(ip);
      
      if (!canAccess) {
        setError('Guest access limit reached for today');
        return;
      }

      await signInAnonymously(auth);
      navigate('/chat');
    } catch (err) {
      console.error('Guest sign-in error:', err);
      setError('Failed to sign in as guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center space-x-2">
          <Logo white className="w-8 h-8" />
          <span className="text-lg font-semibold">7 for all GC</span>
        </div>
        <button
          onClick={() => setShowLanguages(!showLanguages)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
        >
          <Globe size={20} />
          {showLanguages && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-800">
              {['English', 'Српски', 'Español', 'Français', 'Deutsch', 'Italiano', 'Português', 'Русский', '中文', '日本語'].map((lang, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setLanguage(['en', 'sr', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja'][i]);
                    setShowLanguages(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                >
                  <img
                    src={`https://flagcdn.com/24x18/${['gb', 'rs', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'cn', 'jp'][i]}.png`}
                    alt={lang}
                    className="w-6"
                  />
                  <span>{lang}</span>
                </button>
              ))}
            </div>
          )}
        </button>
      </nav>

      <div className="flex flex-col items-center justify-center px-4 py-12 space-y-8">
        {/* Auth Card */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <Logo className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Welcome to 7 for all GC</h2>
              <p className="text-gray-600">Connect with people around the world</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>

              <button
                onClick={handleFacebookSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5" />
                <span>Continue with Facebook</span>
              </button>

              <button
                onClick={handleGuestSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-custom text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <User size={20} />
                <span>Continue as Guest</span>
              </button>

              {loading && (
                <div className="flex items-center justify-center text-primary">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Donation Card */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-full bg-gradient-custom mb-4">
                <Heart size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Support Our Mission</h3>
              <p className="text-gray-600">
                Help us connect people globally and make communication accessible to everyone
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowDonationDetails(!showDonationDetails)}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-custom text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Coffee size={20} />
                <span>Support the Project</span>
              </button>

              {showDonationDetails && (
                <div className="space-y-4 pt-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Why Support Us?</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Enable free communication worldwide</li>
                      <li>• Support multilingual accessibility</li>
                      <li>• Help develop new features</li>
                      <li>• Keep the service running for everyone</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[5, 10, 20].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => window.open(`https://donate.stripe.com/test_amount=${amount}`, '_blank')}
                        className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium text-primary">${amount}</div>
                        <div className="text-xs text-gray-500">One-time</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => window.open('https://patreon.com/yourproject', '_blank')}
                      className="flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img src="https://c5.patreon.com/external/favicon/favicon.ico" alt="Patreon" className="w-4 h-4" />
                      <span className="text-sm font-medium">Patreon</span>
                    </button>
                    
                    <button
                      onClick={() => window.open('https://ko-fi.com/yourproject', '_blank')}
                      className="flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Coffee size={16} className="text-[#13C3FF]" />
                      <span className="text-sm font-medium">Ko-fi</span>
                    </button>

                    <button
                      onClick={() => window.open('https://buymeacoffee.com/yourproject', '_blank')}
                      className="flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <DollarSign size={16} className="text-[#FFDD00]" />
                      <span className="text-sm font-medium">Buy Me a Coffee</span>
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    100% of donations go towards development and server costs
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};