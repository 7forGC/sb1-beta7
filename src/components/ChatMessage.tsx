import React from 'react';
import { useAutoTranslation } from '../hooks/useAutoTranslation';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Globe } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    senderId: string;
    timestamp: number;
    language: string;
  };
  sender: {
    name: string;
    photoURL?: string;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
  const { user } = useAuth();
  const { translatedText, loading, error } = useAutoTranslation(
    message.text,
    message.language
  );

  const isOwnMessage = message.senderId === user?.uid;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-end space-x-2 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {!isOwnMessage && (
          <img
            src={sender.photoURL || 'https://via.placeholder.com/40'}
            alt={sender.name}
            className="w-8 h-8 rounded-full"
          />
        )}
        
        <div className={`
          relative group rounded-lg px-4 py-2 
          ${isOwnMessage 
            ? 'bg-gradient-custom text-white' 
            : 'bg-white border shadow-sm'
          }
        `}>
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Translating...</span>
            </div>
          ) : (
            <>
              <p className={isOwnMessage ? 'text-white' : 'text-gray-800'}>
                {translatedText}
              </p>
              
              {message.language !== user?.settings.language && !error && (
                <div className={`
                  absolute -top-5 left-0 text-xs px-2 py-1 rounded bg-gray-800 
                  text-white opacity-0 group-hover:opacity-100 transition-opacity
                `}>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>Translated from {message.language}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-xs text-red-500 mt-1">
                  Translation failed. Showing original message.
                </div>
              )}
            </>
          )}
          
          <span className={`
            block text-xs mt-1
            ${isOwnMessage ? 'text-white/80' : 'text-gray-500'}
          `}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};