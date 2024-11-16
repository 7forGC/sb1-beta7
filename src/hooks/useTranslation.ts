import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { translationService } from '../services/translationService';

export const useTranslationService = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateMessage = useCallback(async (
    message: string,
    targetLanguage: string
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await translationService.translateMessage(
        message,
        targetLanguage,
        user.uid
      );
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const detectLanguage = useCallback(async (text: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      return await translationService.detectLanguage(text, user.uid);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    translateMessage,
    detectLanguage,
    loading,
    error
  };
};