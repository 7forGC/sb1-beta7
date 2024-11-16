import React, { useState } from 'react';
import { MessageCircle, Bell, Volume2, Play, Square, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSound } from '../../hooks/useSound';
import { RINGTONES } from '../../data/ringtones';

export const MessageNotificationsPage = () => {
  const { user, updateSettings } = useAuth();
  const { play, stop } = useSound();
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const handleToggle = async (setting: string) => {
    if (!user) return;

    await updateSettings({
      notifications: {
        ...user.settings.notifications,
        messages: {
          ...user.settings.notifications.messages,
          [setting]: !user.settings.notifications.messages[setting]
        }
      }
    });
  };

  const handleSoundChange = async (tone: string) => {
    if (!user) return;

    await updateSettings({
      notifications: {
        ...user.settings.notifications,
        messages: {
          ...user.settings.notifications.messages,
          tone
        }
      }
    });
  };

  const handlePlaySound = async (tone: string) => {
    if (playingSound) {
      stop();
      setPlayingSound(null);
      if (playingSound === tone) return;
    }

    setPlayingSound(tone);
    await play('message', tone as any, user?.settings?.notifications?.volume / 100 || 1);
    setPlayingSound(null);
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
              <h1 className="text-2xl font-bold">Message Notifications</h1>
              <p className="text-gray-600 mt-1">Manage how you receive message notifications</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Notification Settings */}
          <section>
            <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
            <div className="space-y-6">
              {/* Message Preview */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Message Preview</h3>
                  <p className="text-sm text-gray-600">Show message content in notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.notifications?.messages?.messagePreview}
                    onChange={() => handleToggle('messagePreview')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Message Sound */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Message Sound</h3>
                  <p className="text-sm text-gray-600">Play sound for new messages</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={user?.settings?.notifications?.messages?.tone || 'default'}
                    onChange={(e) => handleSoundChange(e.target.value)}
                    className="form-select rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
                  >
                    {Object.keys(RINGTONES.message).map((tone) => (
                      <option key={tone} value={tone}>
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handlePlaySound(user?.settings?.notifications?.messages?.tone || 'default')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {playingSound ? (
                      <Square className="w-5 h-5 text-primary" />
                    ) : (
                      <Play className="w-5 h-5 text-primary" />
                    )}
                  </button>
                </div>
              </div>

              {/* LED Light */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">LED Light</h3>
                  <p className="text-sm text-gray-600">Flash LED light for new messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.notifications?.messages?.messageLED}
                    onChange={() => handleToggle('messageLED')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Preview */}
          <section>
            <h2 className="text-lg font-medium mb-4">Notification Preview</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">New Message</div>
                  {user?.settings?.notifications?.messages?.messagePreview ? (
                    <p className="text-sm text-gray-600">
                      This is how your message notifications will appear
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Message content hidden
                    </p>
                  )}
                </div>
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
                onChange={(e) => {
                  if (user) {
                    updateSettings({
                      notifications: {
                        ...user.settings.notifications,
                        volume: parseInt(e.target.value)
                      }
                    });
                  }
                }}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                {user?.settings?.notifications?.volume || 100}%
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};