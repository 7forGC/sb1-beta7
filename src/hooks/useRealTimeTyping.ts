import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { socketService } from '../services/socketService';

export const useRealTimeTyping = (chatId: string, userId: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Debounced function to emit typing status
  const debouncedEmitTyping = useCallback(
    debounce((typing: boolean) => {
      socketService.socket?.emit('typing', {
        chatId,
        userId,
        isTyping: typing
      });
    }, 300),
    [chatId, userId]
  );

  useEffect(() => {
    const socket = socketService.socket;
    if (!socket) return;

    // Listen for typing events
    socket.on('userTyping', ({ userId: typingUserId, isTyping }) => {
      setTypingUsers(prev => {
        if (isTyping && !prev.includes(typingUserId)) {
          return [...prev, typingUserId];
        }
        if (!isTyping) {
          return prev.filter(id => id !== typingUserId);
        }
        return prev;
      });
    });

    return () => {
      socket.off('userTyping');
    };
  }, []);

  const setTypingStatus = (typing: boolean) => {
    setIsTyping(typing);
    debouncedEmitTyping(typing);
  };

  return {
    isTyping,
    typingUsers,
    setTypingStatus
  };
};