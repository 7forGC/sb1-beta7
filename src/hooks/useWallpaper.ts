import { useState } from 'react';
import { useAuth } from './useAuth';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useImageCompression } from './useImageCompression';

export const useWallpaper = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { compressImage } = useImageCompression();

  const uploadWallpaper = async (file: File): Promise<string> => {
    if (!user) throw new Error('Not authenticated');

    setLoading(true);
    try {
      // Compress image before upload
      const compressedFile = await compressImage(file);
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `wallpapers/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, compressedFile);
      
      // Get download URL
      return await getDownloadURL(storageRef);
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadWallpaper,
    loading
  };
};