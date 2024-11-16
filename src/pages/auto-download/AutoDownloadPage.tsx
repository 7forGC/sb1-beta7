import React from 'react';
import { Download, ArrowLeft, Wifi, Signal, HardDrive } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MEDIA_TYPES = [
  { 
    id: 'photos',
    name: 'Photos',
    description: 'Automatically download received photos'
  },
  {
    id: 'videos',
    name: 'Videos',
    description: 'Automatically download received videos'
  },
  {
    id: 'audio',
    name: 'Audio Messages',
    description: 'Automatically download voice messages and audio files'
  },
  {
    id: 'documents',
    name: 'Documents',
    description: 'Automatically download documents and files'
  }
];

const CONNECTION_TYPES = [
  {
    id: 'wifi',
    name: 'Wi-Fi',
    icon: Wifi,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'mobile',
    name: 'Mobile Data',
    icon: Signal,
    color: 'bg-green-100 text-green-600'
  }
];

export const AutoDownloadPage = () => {
  const { user, updateSettings } = useAuth();

  const handleToggleMediaType = async (type: string, connection: string) => {
    if (!user) return;

    const currentSettings = user.settings?.autoDownload?.[connection] || [];
    const newSettings = currentSettings.includes(type)
      ? currentSettings.filter(t => t !== type)
      : [...currentSettings, type];

    await updateSettings({
      autoDownload: {
        ...user.settings?.autoDownload,
        [connection]: newSettings
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
              <h1 className="text-2xl font-bold">Auto-Download</h1>
              <p className="text-gray-600 mt-1">Manage automatic media downloads</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Connection Types */}
          {CONNECTION_TYPES.map(connection => (
            <section key={connection.id}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${connection.color}`}>
                  <connection.icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-medium">{connection.name}</h2>
              </div>

              <div className="space-y-4">
                {MEDIA_TYPES.map(mediaType => (
                  <div key={mediaType.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{mediaType.name}</h3>
                      <p className="text-sm text-gray-600">{mediaType.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={user?.settings?.autoDownload?.[connection.id]?.includes(mediaType.id)}
                        onChange={() => handleToggleMediaType(mediaType.id, connection.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Storage Management */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <HardDrive className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-lg font-medium">Storage Management</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Clear Downloads Weekly</h3>
                  <p className="text-sm text-gray-600">
                    Automatically remove downloaded media after 7 days
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.autoDownload?.clearWeekly}
                    onChange={() => {
                      if (user) {
                        updateSettings({
                          autoDownload: {
                            ...user.settings?.autoDownload,
                            clearWeekly: !user.settings?.autoDownload?.clearWeekly
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
                  <h3 className="font-medium">Low Storage Mode</h3>
                  <p className="text-sm text-gray-600">
                    Disable auto-download when storage is low
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.autoDownload?.lowStorageMode}
                    onChange={() => {
                      if (user) {
                        updateSettings({
                          autoDownload: {
                            ...user.settings?.autoDownload,
                            lowStorageMode: !user.settings?.autoDownload?.lowStorageMode
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

          {/* Tips */}
          <section>
            <h2 className="text-lg font-medium mb-4">Tips</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Media files are compressed before downloading to save space</li>
                <li>• Downloads can be manually triggered even when auto-download is off</li>
                <li>• Files are stored in your device's storage</li>
                <li>• Enable Low Storage Mode to prevent running out of space</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};