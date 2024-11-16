import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Video, Phone, ArrowLeft, Image as ImageIcon, Mic } from 'lucide-react';
import { useKeyboard } from '../hooks/useKeyboard';
import { useAuth } from '../hooks/useAuth';
import { AudioRecorder } from './AudioRecorder';

interface ChatWindowProps {
  onToggleOnlineUsers: () => void;
  onStartCall: (type: 'audio' | 'video', user: any) => void;
  onSelectUser: (user: any) => void;
  selectedUser: any;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  onToggleOnlineUsers,
  onStartCall,
  onSelectUser,
  selectedUser
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();
  const [containerHeight, setContainerHeight] = useState('100%');

  useEffect(() => {
    const updateHeight = () => {
      if (chatContainerRef.current) {
        const headerHeight = 64;
        const inputHeight = 72;
        const windowHeight = window.innerHeight;
        const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-top')) || 0;
        const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-bottom')) || 0;
        
        let availableHeight = windowHeight - headerHeight - inputHeight - safeAreaTop - safeAreaBottom;
        
        if (isKeyboardVisible) {
          availableHeight -= keyboardHeight;
        }
        
        setContainerHeight(`${availableHeight}px`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [isKeyboardVisible, keyboardHeight]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('Image size must be less than 10MB');
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAudioRecorded = (blob: Blob) => {
    // Handle audio recording
    setIsRecording(false);
  };

  const sendMessage = () => {
    if ((!message.trim() && !selectedImage) || !selectedUser) return;

    // Handle message sending here
    setMessage('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b bg-white">
        {selectedUser ? (
          <>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onSelectUser(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={selectedUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.displayName)}`}
                  alt={selectedUser.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-medium">{selectedUser.displayName}</h2>
                  <p className="text-sm text-gray-500">{selectedUser.status}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onStartCall('audio', selectedUser)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Phone size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => onStartCall('video', selectedUser)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Video size={20} className="text-gray-600" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold">Messages</h2>
          </div>
        )}
      </div>
        
      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ 
          height: containerHeight,
          maxHeight: containerHeight
        }}
      >
        {selectedUser ? (
          <div className="space-y-4">
            {/* Messages will be rendered here */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      {selectedUser && (
        <div className="border-t bg-white">
          {/* Image Preview */}
          {previewUrl && (
            <div className="p-4 border-b">
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-32 rounded-lg"
                />
                <button
                  onClick={() => {
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-gray-800 text-white rounded-full"
                >
                  <ArrowLeft size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 flex items-center space-x-2">
            <div className="flex space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-full text-primary transition-colors"
              >
                <ImageIcon size={20} />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </button>
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-full transition-colors ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'text-primary hover:bg-gray-100'
                }`}
              >
                <Mic size={20} />
              </button>
            </div>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim() && !selectedImage}
              className="p-2 bg-gradient-custom text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>

          {/* Audio Recorder */}
          {isRecording && (
            <div className="absolute bottom-full left-0 right-0 p-4 bg-white border-t shadow-lg">
              <AudioRecorder
                onAudioReady={handleAudioRecorded}
                onCancel={() => setIsRecording(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};