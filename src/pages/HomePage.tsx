import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { ChatWindow } from '../components/ChatWindow';
import { OnlineUsers } from '../components/OnlineUsers';

export const HomePage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <ChatWindow />
      <OnlineUsers />
    </div>
  );
};