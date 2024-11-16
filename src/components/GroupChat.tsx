import React, { useState } from 'react';
import { Send, Paperclip, Video, MoreVertical, Users } from 'lucide-react';

interface GroupChatProps {
  group: {
    id: string;
    name: string;
    avatar: string;
    members: string[];
  };
}

export const GroupChat: React.FC<GroupChatProps> = ({ group }) => {
  const [message, setMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    // Handle message sending here
    setMessage('');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="h-16 px-4 flex items-center justify-between bg-white border-b">
        <div className="flex items-center space-x-3">
          <img
            src={group.avatar}
            alt={group.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <h2 className="font-medium">{group.name}</h2>
            <p className="text-sm text-gray-500">{group.members.length} members</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <Users size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Messages will be rendered here */}
        </div>

        {/* Members Sidebar */}
        {showMembers && (
          <div className="w-64 bg-white border-l overflow-y-auto">
            <div className="p-4 border-b">
              <h3 className="font-medium">Group Members</h3>
            </div>
            <div className="p-2">
              {/* Demo members - replace with actual members */}
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                  <img
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-sm">Member {i + 1}</div>
                    <div className="text-xs text-gray-500">Online</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full text-primary transition-colors">
            <Paperclip size={20} />
          </button>
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
            disabled={!message.trim()}
            className="p-2 bg-gradient-custom text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};