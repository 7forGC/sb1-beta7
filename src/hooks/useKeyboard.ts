import { useState, useEffect } from 'react';

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const currentHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const diff = windowHeight - currentHeight;
        
        if (diff > 150) {
          setKeyboardHeight(diff);
          setIsKeyboardVisible(true);
          document.documentElement.style.setProperty('--keyboard-height', `${diff}px`);
          document.body.classList.add('has-keyboard');
        } else {
          setKeyboardHeight(0);
          setIsKeyboardVisible(false);
          document.documentElement.style.setProperty('--keyboard-height', '0px');
          document.body.classList.remove('has-keyboard');
        }
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);

    // Initial check
    handleResize();

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  return { keyboardHeight, isKeyboardVisible };
};