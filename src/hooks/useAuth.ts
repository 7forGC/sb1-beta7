import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService } from '../services/authService';
import type { UserProfile } from '../types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userProfile = await authService.getUserProfile(firebaseUser.uid);
          setUser(userProfile);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await authService.signInWithEmail(email, password);
      setUser(userProfile);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await authService.createUser(email, password, displayName);
      setUser(userProfile);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await authService.signInWithGoogle();
      setUser(userProfile);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await authService.signInWithFacebook();
      setUser(userProfile);
    } catch (err: any) {
      console.error('Facebook sign in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await auth.signOut();
      setUser(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settings: Partial<UserProfile['settings']>) => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      await authService.updateUserSettings(user.uid, settings);
      setUser(prev => prev ? { ...prev, settings: { ...prev.settings, ...settings } } : null);
    } catch (err: any) {
      console.error('Update settings error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    updateSettings
  };
};