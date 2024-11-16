import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { updateService } from '../services/updateService';

export const useUpdates = () => {
  const { user } = useAuth();
  const [currentVersion, setCurrentVersion] = useState('1.0.0');
  const [latestVersion, setLatestVersion] = useState('1.0.0');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [changelog, setChangelog] = useState<{
    version: string;
    date: string;
    changes: string[];
  }[]>([
    {
      version: '1.0.0',
      date: 'March 15, 2024',
      changes: [
        'Initial release',
        'Multi-language support with automatic translation',
        'End-to-end encrypted messaging',
        'HD video and voice calls',
        'Group chat and call features'
      ]
    },
    {
      version: '0.9.0',
      date: 'March 1, 2024',
      changes: [
        'Beta release',
        'Core messaging features',
        'Basic translation support',
        'Voice calls'
      ]
    },
    {
      version: '0.8.0',
      date: 'February 15, 2024',
      changes: [
        'Alpha release',
        'Basic chat functionality',
        'User profiles',
        'Settings framework'
      ]
    }
  ]);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      const { latest, current } = await updateService.checkForUpdates();
      setLatestVersion(latest);
      setCurrentVersion(current);
      setUpdateAvailable(latest !== current);
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const downloadUpdate = async () => {
    if (!updateAvailable) return;

    setDownloading(true);
    try {
      await updateService.downloadUpdate(latestVersion);
      await installUpdate();
    } catch (error) {
      console.error('Error downloading update:', error);
    } finally {
      setDownloading(false);
    }
  };

  const installUpdate = async () => {
    try {
      await updateService.installUpdate();
      window.location.reload();
    } catch (error) {
      console.error('Error installing update:', error);
    }
  };

  return {
    currentVersion,
    latestVersion,
    updateAvailable,
    changelog,
    downloading,
    checkForUpdates,
    downloadUpdate,
    installUpdate
  };
};