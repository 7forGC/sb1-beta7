import { useEffect, useRef } from 'react';
import { RINGTONES } from '../data/ringtones';

export const useAudioPreload = () => {
  const audioRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Preload all ringtones
    Object.entries(RINGTONES).forEach(([category, tones]) => {
      Object.entries(tones).forEach(([name, src]) => {
        const audio = new Audio();
        audio.preload = 'metadata'; // Only load metadata initially
        audio.src = src;
        audioRef.current[`${category}-${name}`] = audio;
      });
    });

    return () => {
      // Cleanup
      Object.values(audioRef.current).forEach(audio => {
        audio.src = '';
        audio.load();
      });
      audioRef.current = {};
    };
  }, []);

  return audioRef.current;
};