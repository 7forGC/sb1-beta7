import React, { useState } from 'react';
import { Network, ArrowLeft, Wifi, Signal, Download, Upload, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNetworkUsage } from '../../hooks/useNetworkUsage';
import { formatBytes } from '../../utils/formatBytes';

export const NetworkUsagePage = () => {
  const { user } = useAuth();
  const { usage, loading, resetStats } = useNetworkUsage();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

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
              <h1 className="text-2xl font-bold">Network Usage</h1>
              <p className="text-gray-600 mt-1">Monitor your data consumption</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Time Period Selection */}
          <div className="flex space-x-2">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedPeriod === period.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Usage Overview */}
          <section>
            <h2 className="text-lg font-medium mb-4">Data Usage Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Wi-Fi Usage */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wifi className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Wi-Fi</h3>
                    <p className="text-sm text-gray-600">
                      {formatBytes(usage.wifi.total)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Downloaded</span>
                    <span>{formatBytes(usage.wifi.downloaded)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uploaded</span>
                    <span>{formatBytes(usage.wifi.uploaded)}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Data Usage */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Signal className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Mobile Data</h3>
                    <p className="text-sm text-gray-600">
                      {formatBytes(usage.mobile.total)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Downloaded</span>
                    <span>{formatBytes(usage.mobile.downloaded)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uploaded</span>
                    <span>{formatBytes(usage.mobile.uploaded)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Usage by Feature */}
          <section>
            <h2 className="text-lg font-medium mb-4">Usage by Feature</h2>
            <div className="space-y-4">
              {Object.entries(usage.features).map(([feature, data]) => (
                <div key={feature} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium capitalize">{feature}</h3>
                    <span className="text-sm text-gray-600">
                      {formatBytes(data.total)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{
                        width: `${(data.total / usage.total) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Data Saving Settings */}
          <section>
            <h2 className="text-lg font-medium mb-4">Data Saving Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Data Saver</h3>
                  <p className="text-sm text-gray-600">
                    Reduce data usage by compressing media
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.network?.dataSaver}
                    onChange={() => {
                      if (user) {
                        user.updateSettings({
                          network: {
                            ...user.settings.network,
                            dataSaver: !user.settings.network?.dataSaver
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
                  <h3 className="font-medium">Auto-Download on Wi-Fi Only</h3>
                  <p className="text-sm text-gray-600">
                    Download media only when connected to Wi-Fi
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.network?.wifiOnly}
                    onChange={() => {
                      if (user) {
                        user.updateSettings({
                          network: {
                            ...user.settings.network,
                            wifiOnly: !user.settings.network?.wifiOnly
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

          {/* Reset Stats */}
          <section>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">Reset Statistics</h2>
                <p className="text-sm text-gray-600">
                  Clear all network usage statistics
                </p>
              </div>
              <button
                onClick={resetStats}
                className="flex items-center space-x-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <RefreshCw size={18} />
                <span>Reset Stats</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};