import React, { useState, useRef } from 'react';
import { 
  Camera,
  Settings as SettingsIcon,
  Edit3,
  LogOut,
  Lock,
  Globe,
  Bell,
  Moon,
  Sun,
  Mail,
  Key,
  AtSign,
  X,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from './UserAvatar';
import { LanguageSelector } from './LanguageSelector';

export const Settings = () => {
  const { t } = useTranslation();
  const { user, signOut, updateSettings } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
    birthdate: user?.birthdate || '',
    website: user?.website || '',
    socialLinks: user?.socialLinks || {
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        setIsUploading(true);
        // Handle avatar upload logic here
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
        theme: user.settings?.theme === 'light' ? 'dark' : 'light'
      });
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // Update profile logic here
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Settings</h1>
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <UserAvatar user={user} size="lg" showLanguage={true} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-3 rounded-full bg-primary text-white"
              >
                <Camera size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <h2 className="text-xl font-bold">{user?.displayName}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Globe className="w-4 h-4 mr-1" />
              <span>Speaks {t(`languages.${user?.settings?.language}`)}</span>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Links
              </label>
              <div className="space-y-4">
                {Object.entries(profileData.socialLinks).map(([platform, link]) => (
                  <div key={platform} className="relative">
                    <AtSign className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                      type="url"
                      placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} profile`}
                      value={link}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        socialLinks: {
                          ...profileData.socialLinks,
                          [platform]: e.target.value
                        }
                      })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Edit/Save Buttons */}
            <div className="flex justify-between">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Settings Section */}
          <div className="mt-8 pt-8 border-t space-y-6">
            {/* Language Settings */}
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

            {/* Theme Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {user?.settings?.theme === 'light' ? (
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
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                {user?.settings?.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="text-gray-500" />
                <div>
                  <div className="font-medium">Privacy</div>
                  <div className="text-sm text-gray-500">Manage your privacy settings</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-gray-100 rounded-lg">
                Configure
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="text-gray-500" />
                <div>
                  <div className="font-medium">Notifications</div>
                  <div className="text-sm text-gray-500">Manage notification preferences</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-gray-100 rounded-lg">
                Configure
              </button>
            </div>

            {/* Sign Out */}
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};