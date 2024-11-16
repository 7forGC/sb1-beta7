import React from 'react';
import { 
  Bell, 
  MessageCircle, 
  Phone, 
  ArrowLeft,
  ChevronRight,
  Volume2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const NOTIFICATION_SECTIONS = [
  {
    id: 'messages',
    title: 'Message Notifications',
    description: 'Manage message alerts and previews',
    icon: MessageCircle,
    path: '/notifications/messages',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'groups',
    title: 'Group Notifications',
    description: 'Manage group message alerts',
    icon: Bell,
    path: '/notifications/groups',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'calls',
    title: 'Call Tones',
    description: 'Manage call ringtones and alerts',
    icon: Phone,
    path: '/notifications/calls',
    color: 'bg-green-100 text-green-600'
  }
];

export const NotificationsPage = () => {
  const { user, updateSettings } = useAuth();

  const handleVolumeChange = (volume: number) => {
    if (!user) return;
    updateSettings({
      notifications: {
        ...user.settings?.notifications,
        volume
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-gray-600 mt-1">Manage your notification preferences</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Notification Sections */}
          <div className="grid gap-4">
            {NOTIFICATION_SECTIONS.map((section) => (
              <Link
                key={section.id}
                to={section.path}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${section.color}`}>
                    <section.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Link>
            ))}
          </div>

          {/* Quick Settings */}
          <section>
            <h2 className="text-lg font-medium mb-4">Quick Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show Notifications</h3>
                  <p className="text-sm text-gray-600">Enable or disable all notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.notifications?.enabled}
                    onChange={() => {
                      if (user) {
                        updateSettings({
                          notifications: {
                            ...user.settings?.notifications,
                            enabled: !user.settings?.notifications?.enabled
                          }
                        });
                      }
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Do Not Disturb</h3>
                  <p className="text-sm text-gray-600">Mute all notifications temporarily</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.notifications?.doNotDisturb}
                    onChange={() => {
                      if (user) {
                        updateSettings({
                          notifications: {
                            ...user.settings?.notifications,
                            doNotDisturb: !user.settings?.notifications?.doNotDisturb
                          }
                        });
                      }
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Volume Control */}
          <section>
            <h2 className="text-lg font-medium mb-4">Volume</h2>
            <div className="flex items-center space-x-4">
              <Volume2 className="w-5 h-5 text-gray-500" />
              <input
                type="range"
                min="0"
                max="100"
                value={user?.settings?.notifications?.volume || 100}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-sm text-gray-600 min-w-[3ch]">
                {user?.settings?.notifications?.volume || 100}%
              </span>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h2 className="text-lg font-medium mb-4">Tips</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Customize notification sounds for different types of alerts</li>
                <li>• Use Do Not Disturb mode during meetings or sleep</li>
                <li>• Enable message previews to quickly see new messages</li>
                <li>• Adjust volume levels for different times of day</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};