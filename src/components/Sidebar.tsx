import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, User, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../hooks/useAuth';
import { UserAvatar } from './UserAvatar';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: MessageSquare, label: 'Chat & Calls', path: '/messages' }
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-40 w-[280px] bg-gradient-sidebar transform transition-transform duration-200 ease-in-out
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full py-4">
        <Link to="/" className="mb-8 text-center px-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto shadow-lg overflow-hidden">
            <Logo white />
          </div>
          <span className="block text-white text-xs mt-2 font-medium">7 for all GC</span>
        </Link>

        <div className="flex-1 space-y-4 px-4">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                isActive(path)
                  ? 'text-white bg-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{label}</span>
            </Link>
          ))}

          <Link
            to="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
              isActive('/profile')
                ? 'text-white bg-white/20'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <User size={20} />
            <span className="text-sm">Profile</span>
          </Link>
        </div>

        <div className="mt-auto space-y-4 px-4">
          {user && (
            <>
              <div className="flex items-center space-x-3 p-2 text-white/70">
                <UserAvatar user={user} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{user.displayName}</div>
                  <div className="text-sm opacity-70 truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-3 w-full p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <LogOut size={20} />
                <span className="text-sm">Sign Out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};