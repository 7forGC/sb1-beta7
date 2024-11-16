import { useCallback } from 'react';

export const useTouchFeedback = () => {
  const addTouchRipple = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    const x = ('touches' in event) 
      ? event.touches[0].clientX - rect.left 
      : (event as React.MouseEvent).clientX - rect.left;
    
    const y = ('touches' in event)
      ? event.touches[0].clientY - rect.top
      : (event as React.MouseEvent).clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.animation = 'ripple 600ms linear';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }, []);

  return { addTouchRipple };
};