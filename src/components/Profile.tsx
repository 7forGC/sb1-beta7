import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Settings, 
  Edit3, 
  Grid, 
  Film,
  Bookmark,
  Heart,
  LogOut,
  Lock,
  Globe,
  Bell,
  Moon,
  Sun,
  Mail,
  Key,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from './UserAvatar';
import { LanguageSelector } from './LanguageSelector';

export const Profile = () => {
  const { t } = useTranslation();
  const { user, signOut, updateSettings } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'liked'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        setIsUploading(true);
        // Handle avatar upload
        console.log('Uploading avatar:', file);
      } catch (error) {
        console.error('Error uploading avatar:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const toggleTheme = () => {
    if (user) {
      updateSettings({
        theme: user.settings.theme === 'light' ? 'dark' : 'light'
      });
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Profile Header */}
      <div className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-start space-x-8">
            {/* Avatar Section */}
            <div className="relative">
              {isUploading ? (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <UserAvatar user={user!} size="lg" showLanguage={true} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{user?.displayName}</h1>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Globe className="w-4 h-4 mr-1" />
                    <span>Speaks {t(`languages.${user?.settings.language}`)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Settings size={20} />
                  </button>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Edit3 size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold">123</div>
                  <div className="text-gray-600">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">1.2K</div>
                  <div className="text-gray-600">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">567</div>
                  <div className="text-gray-600">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Settings</h2>
            
            <div className="space-y-6">
              {/* Account Settings */}
              <div className="pb-6 border-b">
                <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Mail className="text-gray-500" />
                    <div className="text-left">
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center space-x-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Key className="text-gray-500" />
                    <div className="text-left">
                      <div className="font-medium">Password</div>
                      <div className="text-sm text-gray-500">Change your password</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Settings */}
              <div className="pb-6 border-b">
                <h3 className="text-lg font-medium mb-4">Language & Region</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="text-gray-500" />
                    <div>
                      <div className="font-medium">Language</div>
                      <div className="text-sm text-gray-500">Choose your preferred language</div>
                    </div>
                  </div>
                  <LanguageSelector />
                </div>
              </div>

              {/* Theme Settings */}
              <div className="pb-6 border-b">
                <h3 className="text-lg font-medium mb-4">Appearance</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {user?.settings.theme === 'light' ? (
                      <Sun className="text-gray-500" />
                    ) : (
                      <Moon className="text-gray-500" />
                    )}
                    <div>
                      <div className="font-medium">Theme</div>
                      <div className="text-sm text-gray-500">Toggle light/dark mode</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {user?.settings.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="pb-6 border-b">
                <h3 className="text-lg font-medium mb-4">Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Lock className="text-gray-500" />
                      <div>
                        <div className="font-medium">Account Privacy</div>
                        <div className="text-sm text-gray-500">Control who can see your profile</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      Configure
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="pb-6 border-b">
                <h3 className="text-lg font-medium mb-4">Notifications</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="text-gray-500" />
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-gray-500">Manage notification preferences</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    Configure
                  </button>
                </div>
              </div>

              {/* Sign Out */}
              <div className="pt-6">
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'posts'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid size={20} />
            <span>Posts</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bookmark size={20} />
            <span>Saved</span>
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'liked'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Heart size={20} />
            <span>Liked</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group"
            >
              <img
                src={`https://picsum.photos/400?random=${item}`}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart size={20} className="fill-white" />
                      <span>123</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Film size={20} />
                      <span>45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};