import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronRight,
  Shield,
  Download,
  Network,
  Phone,
  UserPlus,
  Heart,
  Settings,
  Lock,
  List,
  Palette,
  Bell,
  HardDrive,
  Info
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../hooks/useAuth';
import { UserAvatar } from './UserAvatar';
import { UserList } from './UserList';

interface MobileNavbarProps {
  onToggleOnlineUsers: () => void;
  onSelectUser?: (user: any) => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ onToggleOnlineUsers, onSelectUser }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleUserSelect = (selectedUser: any) => {
    if (onSelectUser) {
      onSelectUser(selectedUser);
      setShowUserList(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="mobile-header">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {location.pathname === '/messages' && (
              <button
                onClick={() => setShowUserList(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <UserPlus size={24} className="text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex-1 text-center">
            <Logo className="h-8 w-8 mx-auto" />
          </div>

          <div className="w-20">
            {/* Placeholder div to maintain centering */}
          </div>
        </div>
      </header>

      {/* User List Overlay */}
      {showUserList && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUserList(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold">Select User</h2>
            </div>
          </div>
          <UserList 
            searchQuery=""
            selectedUser={null}
            onSelectUser={handleUserSelect}
          />
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="w-[280px] h-full bg-white overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="p-4 bg-gradient-custom">
              {user ? (
                <div className="flex items-center space-x-3 text-white">
                  <UserAvatar user={user} size="lg" showLanguage={true} />
                  <div>
                    <div className="font-medium">{user.displayName}</div>
                    <div className="text-sm opacity-80">{user.email}</div>
                  </div>
                </div>
              ) : (
                <Link to="/auth" className="flex items-center space-x-3 text-white">
                  <Logo white />
                  <span className="font-medium">7 for all GC</span>
                </Link>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {MENU_ITEMS.map((item, index) => 
                item.divider ? (
                  <div key={index} className="my-2 border-t border-gray-200" />
                ) : (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 ${
                      isActive(item.path) ? 'text-primary' : 'text-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                )
              )}
            </div>

            {/* Sign Out Button */}
            {user && (
              <div className="p-4 border-t">
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};