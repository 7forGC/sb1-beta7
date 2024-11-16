import React, { useState } from 'react';
import { Phone, Volume2, Play, Square, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSound } from '../../hooks/useSound';
import { RINGTONES } from '../../data/ringtones';

export const CallTonesPage = () => {
  const { user, updateSettings } = useAuth();
  const { play, stop } = useSound();
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const handleToggle = async (setting: string) => {
    if (!user) return;

    await updateSettings({
      notifications: {
        ...user.settings.notifications,
        calls: {
          ...user.settings.notifications.calls,
          [setting]: !user.settings.notifications.calls[setting]
        }
      }
    });
  };

  const handleRingtoneChange = async (tone: string) => {
    if (!user) return;

    await updateSettings({
      notifications: {
        ...user.settings.notifications,
        calls: {
          ...user.settings.notifications.calls,
          ringtone: tone
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
    await play('call', tone as any, user?.settings?.notifications?.volume / 100 || 1);
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
              <h1 className="text-2xl font-bold">Call Tones</h1>
              <p className="text-gray-600 mt-1">Manage your call ringtones and notification settings</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Ringtone Settings */}
          <section>
            <h2 className="text-lg font-medium mb-4">Ringtone Settings</h2>
            <div className="space-y-6">
              {/* Call Ringtone */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Call Ringtone</h3>
                    <p className="text-sm text-gray-600">Choose your incoming call ringtone</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={user?.settings?.notifications?.calls?.ringtone || 'default'}
                      onChange={(e) => handleRingtoneChange(e.target.value)}
                      className="form-select rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
                    >
                      {Object.keys(RINGTONES.call).map((tone) => (
                        <option key={tone} value={tone}>
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handlePlaySound(user?.settings?.notifications?.calls?.ringtone || 'default')}
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

                {/* Ringtone Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Incoming Call</div>
                      <p className="text-sm text-gray-600">
                        {user?.settings?.notifications?.calls?.ringtone || 'Default'} ringtone
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call Vibration */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Call Vibration</h3>
                  <p className="text-sm text-gray-600">Vibrate for incoming calls</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.notifications?.calls?.callVibrate}
                    onChange={() => handleToggle('callVibrate')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Missed Calls */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Missed Call Notifications</h3>
                  <p className="text-sm text-gray-600">Show notifications for missed calls</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.notifications?.calls?.missedCalls}
                    onChange={() => handleToggle('missedCalls')}
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

          {/* Additional Settings */}
          <section>
            <h2 className="text-lg font-medium mb-4">Additional Settings</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <h3 className="font-medium mb-2">Ringtone Tips</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Ringtone will play at the selected volume level</li>
                  <li>• Vibration works even when the phone is in silent mode</li>
                  <li>• Missed call notifications include caller information</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};