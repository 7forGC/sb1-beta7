import React, { useState } from 'react';
import { 
  RefreshCw, 
  ArrowLeft, 
  Download,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUpdates } from '../../hooks/useUpdates';

export const UpdatesPage = () => {
  const { user } = useAuth();
  const { 
    currentVersion,
    latestVersion,
    updateAvailable,
    changelog,
    downloading,
    checkForUpdates,
    downloadUpdate,
    installUpdate
  } = useUpdates();
  const [showChangelog, setShowChangelog] = useState(false);

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
              <h1 className="text-2xl font-bold">Updates</h1>
              <p className="text-gray-600 mt-1">Check for app updates</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Current Version */}
          <section>
            <h2 className="text-lg font-medium mb-4">Current Version</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Version {currentVersion}</div>
                  <p className="text-sm text-gray-600">
                    {updateAvailable ? 'Update available' : 'Up to date'}
                  </p>
                </div>
                <button
                  onClick={checkForUpdates}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Check for updates"
                >
                  <RefreshCw size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </section>

          {/* Update Available */}
          {updateAvailable && (
            <section>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium">Update Available</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Version {latestVersion} is now available
                    </p>
                    <button
                      onClick={downloadUpdate}
                      disabled={downloading}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
                    >
                      {downloading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 size={18} className="animate-spin" />
                          <span>Downloading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Download size={18} />
                          <span>Download Update</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Changelog */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">What's New</h2>
              <button
                onClick={() => setShowChangelog(!showChangelog)}
                className="text-sm text-primary hover:text-primary-dark"
              >
                {showChangelog ? 'Show Less' : 'Show All'}
              </button>
            </div>
            <div className="space-y-4">
              {(showChangelog ? changelog : changelog.slice(0, 3)).map((release, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">Version {release.version}</div>
                      <div className="text-sm text-gray-500">{release.date}</div>
                    </div>
                    {release.version === currentVersion && (
                      <div className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                        Current
                      </div>
                    )}
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {release.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="flex items-start space-x-2">
                        <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Auto Updates */}
          <section>
            <h2 className="text-lg font-medium mb-4">Update Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Automatic Updates</h3>
                  <p className="text-sm text-gray-600">
                    Download and install updates automatically
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.updates?.auto}
                    onChange={() => {
                      if (user) {
                        user.updateSettings({
                          updates: {
                            ...user.settings?.updates,
                            auto: !user.settings?.updates?.auto
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
                  <h3 className="font-medium">Update on Wi-Fi Only</h3>
                  <p className="text-sm text-gray-600">
                    Only download updates when connected to Wi-Fi
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user?.settings?.updates?.wifiOnly}
                    onChange={() => {
                      if (user) {
                        user.updateSettings({
                          updates: {
                            ...user.settings?.updates,
                            wifiOnly: !user.settings?.updates?.wifiOnly
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

          {/* Beta Program */}
          <section>
            <h2 className="text-lg font-medium mb-4">Beta Program</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Join Beta Program</div>
                  <p className="text-sm text-gray-600">
                    Get early access to new features
                  </p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};