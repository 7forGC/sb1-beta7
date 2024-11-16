import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { storageService } from '../services/storageService';

export const useStorageUsage = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsage = async () => {
      if (!user) return;

      try {
        const storageUsage = await storageService.getStorageUsage(user.uid);
        setUsage(storageUsage);
      } catch (error) {
        console.error('Error loading storage usage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsage();
  }, [user]);

  const clearCache = async () => {
    if (!user) return;

    try {
      await storageService.clearCache(user.uid);
      const updatedUsage = await storageService.getStorageUsage(user.uid);
      setUsage(updatedUsage);
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  };

  const deleteUnusedFiles = async () => {
    if (!user) return;

    try {
      await storageService.deleteUnusedFiles(user.uid);
      const updatedUsage = await storageService.getStorageUsage(user.uid);
      setUsage(updatedUsage);
    } catch (error) {
      console.error('Error deleting unused files:', error);
      throw error;
    }
  };

  return {
    usage,
    loading,
    clearCache,
    deleteUnusedFiles
  };
};