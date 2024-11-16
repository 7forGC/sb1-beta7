import { useState, useCallback } from 'react';
import { useBackgroundEffects } from './useBackgroundEffects';

type VideoEffect = 'none' | 'blur' | 'virtual';

export const useVideoEffects = () => {
  const [currentEffect, setCurrentEffect] = useState<VideoEffect>('none');
  const { applyBackgroundBlur } = useBackgroundEffects();

  const applyEffect = useCallback(async (
    videoTrack: MediaStreamTrack,
    effect: VideoEffect
  ) => {
    switch (effect) {
      case 'blur':
        return await applyBackgroundBlur(videoTrack);
      case 'virtual':
        // Implement virtual background
        return videoTrack;
      default:
        return videoTrack;
    }
  }, [applyBackgroundBlur]);

  const changeEffect = useCallback(async (
    videoTrack: MediaStreamTrack,
    effect: VideoEffect
  ) => {
    const processedTrack = await applyEffect(videoTrack, effect);
    setCurrentEffect(effect);
    return processedTrack;
  }, [applyEffect]);

  return {
    currentEffect,
    changeEffect
  };
};