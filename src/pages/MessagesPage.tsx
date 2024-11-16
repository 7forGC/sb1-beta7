import React, { useState } from 'react';
import { ChatWindow } from '../components/ChatWindow';
import { OnlineUsers } from '../components/OnlineUsers';
import { VideoCall } from '../components/VideoCall';
import { AudioCall } from '../components/AudioCall';
import { MobileNavbar } from '../components/MobileNavbar';
import { RecentUsers } from '../components/RecentUsers';

export const MessagesPage = () => {
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAudioCall, setShowAudioCall] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleStartCall = (type: 'audio' | 'video', user: any) => {
    setSelectedUser(user);
    if (type === 'video') {
      setShowVideoCall(true);
    } else {
      setShowAudioCall(true);
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <MobileNavbar 
        onToggleOnlineUsers={() => setShowOnlineUsers(!showOnlineUsers)}
        onSelectUser={handleSelectUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex min-w-0 relative">
        {showVideoCall && selectedUser ? (
          <VideoCall onClose={() => setShowVideoCall(false)} />
        ) : showAudioCall && selectedUser ? (
          <AudioCall
            recipientId={selectedUser.id}
            recipientName={selectedUser.displayName}
            recipientAvatar={selectedUser.photoURL}
            onClose={() => {
              setShowAudioCall(false);
              setSelectedUser(null);
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Recent Users */}
            {!selectedUser && (
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <RecentUsers onSelectUser={handleSelectUser} />
              </div>
            )}

            {/* Chat Window */}
            <ChatWindow 
              onToggleOnlineUsers={() => setShowOnlineUsers(!showOnlineUsers)}
              onStartCall={(type, user) => handleStartCall(type, user)}
              onSelectUser={handleSelectUser}
              selectedUser={selectedUser}
            />
          </div>
        )}

        {/* Online Users Sidebar */}
        {showOnlineUsers && (
          <OnlineUsers 
            isOpen={showOnlineUsers} 
            onClose={() => setShowOnlineUsers(false)}
            onStartCall={handleStartCall}
          />
        )}
      </div>
    </div>
  );
};