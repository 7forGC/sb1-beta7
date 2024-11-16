import React from 'react';
import { Shield, Eye, Lock, UserX } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const PrivacyPage = () => {
  const { user, updateSettings } = useAuth();

  const privacySettings = [
    {
      id: 'onlineStatus',
      title: 'Online Status',
      description: 'Show when you are online',
      icon: Eye,
      enabled: user?.settings?.privacy?.showOnlineStatus ?? false
    },
    {
      id: 'lastSeen',
      title: 'Last Seen',
      description: 'Show when you were last active',
      icon: Lock,
      enabled: user?.settings?.privacy?.showLastSeen ?? false
    },
    {
      id: 'readReceipts',
      title: 'Read Receipts',
      description: 'Show when you have read messages',
      icon: Shield,
      enabled: user?.settings?.privacy?.showReadReceipts ?? false
    }
  ];

  const handleToggle = async (settingId: string) => {
    if (!user) return;

    const newSettings = {
      ...user.settings,
      privacy: {
        ...user.settings.privacy,
        [settingId]: !user.settings.privacy[settingId as keyof typeof user.settings.privacy]
      }
    };

    await updateSettings(newSettings);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Privacy Settings</h1>
          <p className="text-gray-600 mt-2">Manage who can see your information</p>
        </div>

        <div className="p-6 space-y-6">
          {privacySettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <setting.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{setting.title}</h3>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={setting.enabled}
                  onChange={() => handleToggle(setting.id)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}

          <div className="mt-8 border-t pt-6">
            <h3 className="font-medium mb-4">Blocked Users</h3>
            {user?.blockedUsers?.length ? (
              <div className="space-y-4">
                {user.blockedUsers.map((blockedUser) => (
                  <div key={blockedUser} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <UserX className="w-5 h-5 text-gray-500" />
                      <span>{blockedUser}</span>
                    </div>
                    <button
                      onClick={() => {/* Handle unblock */}}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No blocked users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};