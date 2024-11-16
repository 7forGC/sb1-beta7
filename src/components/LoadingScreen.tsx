import React from 'react';
import { Logo } from './Logo';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-custom flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 animate-pulse">
          <Logo white />
        </div>
        <h2 className="text-white text-xl font-medium">Loading...</h2>
      </div>
    </div>
  );
};