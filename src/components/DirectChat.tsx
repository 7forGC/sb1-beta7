import React, { useState } from 'react';
import { Send, Paperclip, Phone, Video, MoreVertical } from 'lucide-react';

interface DirectChatProps {
  contact: {
    id: string;
    name: string;
    status: string;
    avatar: string;
  };
}

export const DirectChat: React.FC<DirectChatProps> = ({ contact }) => {
  const [message, setMessage] = useState('');

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
            src={contact.avatar}
            alt={contact.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-medium">{contact.name}</h2>
            <p className="text-sm text-gray-500">{contact.status}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <Phone size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Messages will be rendered here */}
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