import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { networkService } from '../services/networkService';

interface NetworkUsage {
  wifi: {
    downloaded: number;
    uploaded: number;
    total: number;
  };
  mobile: {
    downloaded: number;
    uploaded: number;
    total: number;
  };
  features: {
    [key: string]: {
      downloaded: number;
      uploaded: number;
      total: number;
    };
  };
  total: number;
}

export const useNetworkUsage = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<NetworkUsage>({
    wifi: { downloaded: 0, uploaded: 0, total: 0 },
    mobile: { downloaded: 0, uploaded: 0, total: 0 },
    features: {},
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsage = async () => {
      if (!user) return;

      try {
        const networkUsage = await networkService.getNetworkUsage(user.uid);
        setUsage(networkUsage);
      } catch (error) {
        console.error('Error loading network usage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsage();
  }, [user]);

  const resetStats = async () => {
    if (!user) return;

    try {
      await networkService.resetNetworkStats(user.uid);
      setUsage({
        wifi: { downloaded: 0, uploaded: 0, total: 0 },
        mobile: { downloaded: 0, uploaded: 0, total: 0 },
        features: {},
        total: 0
      });
    } catch (error) {
      console.error('Error resetting network stats:', error);
      throw error;
    }
  };

  return {
    usage,
    loading,
    resetStats
  };
};