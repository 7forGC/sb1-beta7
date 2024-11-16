import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { userService } from '../services/userService';
import type { User } from '../types';

interface Story {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  views: string[];
  timestamp: number;
}

interface StoryViewerProps {
  stories: Story[];
  currentUser: User;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, currentUser, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const viewedStoriesRef = useRef<Set<string>>(new Set());
  const isMarkingViewRef = useRef(false);

  const markAsViewed = useCallback(async (storyId: string) => {
    if (!currentUser?.id || viewedStoriesRef.current.has(storyId) || isMarkingViewRef.current) return;
    
    try {
      isMarkingViewRef.current = true;
      await userService.markStoryAsViewed(storyId, currentUser.id);
      viewedStoriesRef.current.add(storyId);
    } catch (error) {
      console.error('Error marking story as viewed:', error);
    } finally {
      isMarkingViewRef.current = false;
    }
  }, [currentUser]);

  useEffect(() => {
    if (!stories.length || !currentUser?.id) return;
    
    const currentStory = stories[currentIndex];
    if (!currentStory) return;

    // Only mark as viewed if not already viewed
    if (Array.isArray(currentStory.views) && 
        !currentStory.views.includes(currentUser.id) && 
        !viewedStoriesRef.current.has(currentStory.id)) {
      markAsViewed(currentStory.id);
    }
  }, [currentIndex, stories, currentUser, markAsViewed]);

  useEffect(() => {
    if (!stories.length) return;

    const story = stories[currentIndex];
    const duration = story.mediaType === 'video' ? 
      (videoRef.current?.duration || 10) * 1000 : 
      5000; // 5 seconds for images

    setProgress(0);

    if (!isPaused) {
      const interval = 100; // Update progress every 100ms
      const step = (interval / duration) * 100;

      timerRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (currentIndex < stories.length - 1) {
              setCurrentIndex(prev => prev + 1);
              return 0;
            } else {
              clearInterval(timerRef.current);
              onClose();
              return prev;
            }
          }
          return prev + step;
        });
      }, interval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, stories, isPaused, onClose]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchX = e.touches[0].clientX;
    const screenWidth = window.innerWidth;
    const threshold = screenWidth / 3;

    if (touchX < threshold) {
      handlePrevious();
    } else if (touchX > screenWidth - threshold) {
      handleNext();
    }

    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  if (!stories.length || !currentUser) return null;

  const currentStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Progress Bar */}
      <div className="absolute top-safe-area left-0 right-0 z-10 flex space-x-1 p-2">
        {stories.map((_, index) => (
          <div 
            key={index} 
            className="flex-1 h-0.5 bg-white/30 overflow-hidden rounded-full"
          >
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ 
                width: index === currentIndex ? `${progress}%` : 
                       index < currentIndex ? '100%' : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Content */}
      <div 
        className="h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full md:h-auto md:max-w-lg md:aspect-[9/16]">
          {currentStory.mediaType === 'video' ? (
            <video
              ref={videoRef}
              src={currentStory.mediaUrl}
              autoPlay
              playsInline
              muted
              loop={false}
              className="w-full h-full object-cover"
              onEnded={handleNext}
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover"
            />
          )}

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
            style={{ display: currentIndex === 0 ? 'none' : 'block' }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-safe-area right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};