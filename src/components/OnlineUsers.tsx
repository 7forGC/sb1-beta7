import React from 'react';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '../hooks/useAuth';
import { X, Phone, Video } from 'lucide-react';

interface OnlineUsersProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCall: (type: 'audio' | 'video', user: any) => void;
}

// Demo users data
const DEMO_USERS = [
  { 
    id: '1', 
    displayName: 'Ana M.', 
    status: 'online', 
    settings: { language: 'sr' }, 
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  },
  { 
    id: '2', 
    displayName: 'Marko P.', 
    status: 'online', 
    settings: { language: 'en' }, 
    photoURL: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
  },
  { 
    id: '3', 
    displayName: 'Jana N.', 
    status: 'online', 
    settings: { language: 'de' }, 
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
  }
];

export const OnlineUsers: React.FC<OnlineUsersProps> = ({ isOpen, onClose, onStartCall }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white border-l overflow-hidden flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-medium">Online Users</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {DEMO_USERS.map((user) => (
          <div
            key={user.id}
            className="p-4 hover:bg-gray-50 border-b"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <UserAvatar user={user} size="md" showLanguage={true} />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                    user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div>
                  <div className="font-medium">{user.displayName}</div>
                  <div className="text-sm text-gray-500">{user.status}</div>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => onStartCall('audio', user)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                >
                  <Phone size={18} />
                </button>
                <button
                  onClick={() => onStartCall('video', user)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                >
                  <Video size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};