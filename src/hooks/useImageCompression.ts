import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

export const useImageCompression = () => {
  const [compressing, setCompressing] = useState(false);

  const compressImage = useCallback(async (file: File) => {
    try {
      setCompressing(true);
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Image compression error:', error);
      throw error;
    } finally {
      setCompressing(false);
    }
  }, []);

  return {
    compressImage,
    compressing
  };
};