import { useState } from 'react';
import { inviteService } from '../services/inviteService';
import { useAuth } from './useAuth';

export const useInvite = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackInvite = async (method: 'email' | 'sms' | 'qr' | 'link') => {
    if (!user) return;
    
    setLoading(true);
    try {
      await inviteService.trackInvite(user.uid, method);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateInviteCode = async (code: string) => {
    setLoading(true);
    try {
      const inviterId = await inviteService.validateInviteCode(code);
      return inviterId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trackInvite,
    validateInviteCode,
    loading,
    error
  };
};