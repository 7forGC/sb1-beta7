import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { UserAvatar } from './UserAvatar';

// Demo users data - replace with actual data from your backend
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
  },
  { 
    id: '4', 
    displayName: 'Stefan K.', 
    status: 'offline', 
    settings: { language: 'fr' }, 
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
  },
  { 
    id: '5', 
    displayName: 'Mila R.', 
    status: 'online', 
    settings: { language: 'it' }, 
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'
  }
];

interface UserListProps {
  searchQuery: string;
  selectedUser: any;
  onSelectUser: (user: any) => void;
}

export const UserList: React.FC<UserListProps> = ({
  searchQuery,
  selectedUser,
  onSelectUser
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const filteredUsers = DEMO_USERS.filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowVirtualizer = useVirtualizer({
    count: filteredUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5
  });

  const formatLastSeen = (status: string) => {
    if (status === 'online') return 'Active now';
    if (status === 'away') return 'Away';
    return 'Last seen recently';
  };

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-auto"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const user = filteredUsers[virtualRow.index];
          return (
            <div
              key={user.id}
              className={`absolute top-0 left-0 w-full ${
                selectedUser?.id === user.id ? 'bg-primary/5' : 'hover:bg-gray-50'
              }`}
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <button
                onClick={() => onSelectUser(user)}
                className="w-full h-full p-3 flex items-center space-x-3"
              >
                <div className="relative">
                  <UserAvatar user={user} size="md" showLanguage={true} />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                    user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="font-medium truncate">{user.displayName}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {formatLastSeen(user.status)}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};