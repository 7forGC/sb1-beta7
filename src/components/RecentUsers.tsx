import React from 'react';
import { UserAvatar } from './UserAvatar';

// Demo recent users data - replace with actual data from your backend
const RECENT_USERS = [
  { 
    id: '1', 
    displayName: 'Ana M.', 
    status: 'online', 
    settings: { language: 'sr' }, 
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    lastActivity: 'Posted a photo 5m ago'
  },
  { 
    id: '2', 
    displayName: 'Marko P.', 
    status: 'online', 
    settings: { language: 'en' }, 
    photoURL: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    lastActivity: 'Shared a story 15m ago'
  },
  { 
    id: '3', 
    displayName: 'Jana N.', 
    status: 'online', 
    settings: { language: 'de' }, 
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    lastActivity: 'Posted a video 30m ago'
  }
];

interface RecentUsersProps {
  onSelectUser?: (user: any) => void;
}

export const RecentUsers: React.FC<RecentUsersProps> = ({ onSelectUser }) => {
  const handleUserSelect = (user: any) => {
    if (onSelectUser) {
      onSelectUser(user);
    }
  };

  return (
    <div className="space-y-4">
      {RECENT_USERS.map(user => (
        <div
          key={user.id}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            onSelectUser ? 'hover:bg-gray-50 cursor-pointer' : ''
          }`}
          onClick={() => handleUserSelect(user)}
        >
          <div className="relative">
            <UserAvatar user={user} size="md" showLanguage={true} />
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
              user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
            }`} />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium">{user.displayName}</div>
            <div className="text-sm text-gray-500">{user.lastActivity}</div>
          </div>
        </div>
      ))}
    </div>
  );
};