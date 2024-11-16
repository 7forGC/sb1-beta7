import { useCallback, useRef } from 'react';
import { RINGTONES, RingtoneCategory, RingtoneName } from '../data/ringtones';

export const useSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(<T extends RingtoneCategory>(
    category: T,
    tone: RingtoneName<T>,
    volume = 1
  ) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(RINGTONES[category][tone]);
    audio.volume = volume;
    audioRef.current = audio;
    
    return audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  return { play, stop };
};