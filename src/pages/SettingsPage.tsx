import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Settings } from '../components/Settings';

export const SettingsPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <Settings />
    </div>
  );
};