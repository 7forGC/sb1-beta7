import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Users, Phone, User } from 'lucide-react';

const NAV_ITEMS = [
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Users, label: 'Feed', path: '/feed' },
  { icon: Phone, label: 'Calls', path: '/calls' },
  { icon: User, label: 'Profile', path: '/profile' }
];

export const MobileFooter = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="mobile-footer">
      <div className="h-full grid grid-cols-4">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center space-y-1 ${
              isActive(path) ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};