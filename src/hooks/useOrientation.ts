import { useState, useEffect } from 'react';

type Orientation = 'portrait' | 'landscape';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<Orientation>(
    window.screen.orientation?.type.includes('portrait') ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      const newOrientation = window.screen.orientation?.type.includes('portrait') 
        ? 'portrait' 
        : 'landscape';
      setOrientation(newOrientation);
      
      // Update CSS custom property for vh
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // Initial vh calculation
    handleOrientationChange();

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientation;
};