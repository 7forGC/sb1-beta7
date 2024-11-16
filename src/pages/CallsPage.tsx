import React, { useState } from 'react';
import { Phone, Video, Clock, Search, X, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { VideoCall } from '../components/VideoCall';
import { AudioCall } from '../components/AudioCall';

// Demo calls data
const DEMO_CALLS = [
  {
    id: '1',
    type: 'video',
    status: 'missed',
    timestamp: Date.now() - 1800000,
    user: {
      id: '1',
      name: 'Ana Marković',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      status: 'online'
    }
  },
  {
    id: '2',
    type: 'audio',
    status: 'completed',
    duration: '5:23',
    timestamp: Date.now() - 3600000,
    user: {
      id: '2',
      name: 'Marko Petrović',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
      status: 'offline'
    }
  }
];

export const CallsPage = () => {
  const { user } = useAuth();
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAudioCall, setShowAudioCall] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMissedCallActions, setShowMissedCallActions] = useState<string | null>(null);

  const filteredCalls = DEMO_CALLS.filter(call =>
    call.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartCall = (type: 'audio' | 'video', user: any) => {
    setSelectedUser(user);
    if (type === 'video') {
      setShowVideoCall(true);
    } else {
      setShowAudioCall(true);
    }
    setShowMissedCallActions(null);
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return `${Math.floor(hours / 24)}d`;
    }
    if (hours > 0) {
      return `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b">
          <h1 className="text-xl font-semibold">Calls</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search calls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <button
              onClick={() => {/* Handle group call */}}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Users size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calls List */}
        <div className="flex-1 overflow-y-auto">
          {filteredCalls.length > 0 ? (
            <div className="divide-y">
              {filteredCalls.map((call) => (
                <div
                  key={call.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    showMissedCallActions === call.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => {
                    if (call.status === 'missed') {
                      setShowMissedCallActions(
                        showMissedCallActions === call.id ? null : call.id
                      );
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={call.user.avatar}
                          alt={call.user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                          call.user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium">{call.user.name}</div>
                        <div className="flex items-center space-x-2 text-sm">
                          {call.type === 'video' ? (
                            <Video size={16} className="text-gray-500" />
                          ) : (
                            <Phone size={16} className="text-gray-500" />
                          )}
                          <span className={call.status === 'missed' ? 'text-red-500' : 'text-gray-500'}>
                            {call.status === 'missed' ? 'Missed Call' : call.duration}
                          </span>
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-gray-400">
                            {formatTimestamp(call.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {call.status !== 'missed' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartCall('audio', {
                              id: call.user.id,
                              displayName: call.user.name,
                              photoURL: call.user.avatar
                            });
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Phone size={20} className="text-primary" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartCall('video', {
                              id: call.user.id,
                              displayName: call.user.name,
                              photoURL: call.user.avatar
                            });
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Video size={20} className="text-primary" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Missed Call Actions */}
                  {call.status === 'missed' && showMissedCallActions === call.id && (
                    <div className="mt-4 flex justify-center space-x-4">
                      <button
                        onClick={() => handleStartCall('audio', {
                          id: call.user.id,
                          displayName: call.user.name,
                          photoURL: call.user.avatar
                        })}
                        className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Phone size={20} />
                          <span>Call Back</span>
                        </div>
                      </button>
                      <button
                        onClick={() => handleStartCall('video', {
                          id: call.user.id,
                          displayName: call.user.name,
                          photoURL: call.user.avatar
                        })}
                        className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Video size={20} />
                          <span>Video Call</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Phone size={48} className="mb-4" />
              <p className="text-lg font-medium">No calls yet</p>
              <p className="text-sm">Start a call with someone</p>
            </div>
          )}
        </div>
      </div>

      {/* Call Modals */}
      {showVideoCall && selectedUser && (
        <VideoCall
          onClose={() => {
            setShowVideoCall(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showAudioCall && selectedUser && (
        <AudioCall
          recipientId={selectedUser.id}
          recipientName={selectedUser.displayName}
          recipientAvatar={selectedUser.photoURL}
          onClose={() => {
            setShowAudioCall(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};