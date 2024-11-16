import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { translationService } from '../services/translationService';

export const useAutoTranslation = (originalText: string, senderLanguage: string) => {
  const { user } = useAuth();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const translateIfNeeded = async () => {
      if (!user || !originalText || senderLanguage === user.settings.language) {
        setTranslatedText(originalText);
        return;
      }

      setLoading(true);
      try {
        const result = await translationService.translateMessage(
          originalText,
          user.settings.language,
          user.uid
        );
        setTranslatedText(result.translatedText);
      } catch (err: any) {
        console.error('Auto translation error:', err);
        setError(err.message);
        setTranslatedText(originalText); // Fallback to original text
      } finally {
        setLoading(false);
      }
    };

    translateIfNeeded();
  }, [originalText, senderLanguage, user]);

  return { translatedText, loading, error };
};