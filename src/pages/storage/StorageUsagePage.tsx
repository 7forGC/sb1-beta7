import React, { useState, useEffect } from 'react';
import { HardDrive, ArrowLeft, Trash2, Download, Image, Video, File, Music } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useStorageUsage } from '../../hooks/useStorageUsage';
import { formatBytes } from '../../utils/formatBytes';

export const StorageUsagePage = () => {
  const { user } = useAuth();
  const { usage, loading, clearCache, deleteUnusedFiles } = useStorageUsage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'images', name: 'Images', icon: Image, color: 'bg-blue-100 text-blue-600' },
    { id: 'videos', name: 'Videos', icon: Video, color: 'bg-purple-100 text-purple-600' },
    { id: 'audio', name: 'Audio', icon: Music, color: 'bg-green-100 text-green-600' },
    { id: 'documents', name: 'Documents', icon: File, color: 'bg-orange-100 text-orange-600' },
    { id: 'other', name: 'Other', icon: HardDrive, color: 'bg-gray-100 text-gray-600' }
  ];

  const totalSpace = 5 * 1024 * 1024 * 1024; // 5GB total storage
  const usedSpace = Object.values(usage).reduce((acc, val) => acc + val, 0);
  const usedPercentage = (usedSpace / totalSpace) * 100;

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
              <h1 className="text-2xl font-bold">Storage Usage</h1>
              <p className="text-gray-600 mt-1">Manage your storage space</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Storage Overview */}
          <section>
            <h2 className="text-lg font-medium mb-4">Storage Overview</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{formatBytes(usedSpace)} used</span>
                  <span>{formatBytes(totalSpace)} total</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${usedPercentage}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      selectedCategory === category.id
                        ? 'border-primary'
                        : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center mb-2`}>
                      <category.icon size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatBytes(usage[category.id] || 0)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={clearCache}
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Clear Cache</div>
                  <div className="text-sm text-gray-500">Free up space by clearing cached files</div>
                </div>
              </button>

              <button
                onClick={deleteUnusedFiles}
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Delete Unused Files</div>
                  <div className="text-sm text-gray-500">Remove files not accessed in 30 days</div>
                </div>
              </button>
            </div>
          </section>

          {/* Storage Tips */}
          <section>
            <h2 className="text-lg font-medium mb-4">Storage Tips</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Media files are automatically compressed to save space</li>
                <li>• Unused files are automatically removed after 30 days</li>
                <li>• You can manually clear cache to free up space</li>
                <li>• Downloaded files can be found in your device's storage</li>
              </ul>
            </div>
          </section>

          {/* Download Settings */}
          <section>
            <h2 className="text-lg font-medium mb-4">Download Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-Download Media</h3>
                  <p className="text-sm text-gray-600">Automatically download received media</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.storage?.autoDownload}
                    onChange={() => {
                      if (user) {
                        user.updateSettings({
                          storage: {
                            ...user.settings.storage,
                            autoDownload: !user.settings.storage?.autoDownload
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
                  <h3 className="font-medium">Download Over Wi-Fi Only</h3>
                  <p className="text-sm text-gray-600">Save mobile data by downloading on Wi-Fi</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.storage?.wifiOnly}
                    onChange={() => {
                      if (user) {
                        user.updateSettings({
                          storage: {
                            ...user.settings.storage,
                            wifiOnly: !user.settings.storage?.wifiOnly
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
        </div>
      </div>
    </div>
  );
};