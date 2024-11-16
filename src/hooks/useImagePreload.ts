import { useEffect, useRef } from 'react';

export const useImagePreload = (imageSources: string[]) => {
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    imagesRef.current = imageSources.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    return () => {
      imagesRef.current.forEach(img => {
        img.src = '';
      });
      imagesRef.current = [];
    };
  }, [imageSources]);
};