import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Smartphone, 
  History, 
  Lock, 
  AlertTriangle,
  LogOut,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDeviceSessions } from '../../hooks/useDeviceSessions';
import { twoFactorService } from '../../services/twoFactorService';
import QRCode from 'qrcode.react';

export const SecurityPage = () => {
  const { user, updateSettings } = useAuth();
  const { sessions, terminateSession, terminateAllOtherSessions } = useDeviceSessions();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState<{
    secret?: string;
    qrCode?: string;
  } | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await twoFactorService.updatePassword(currentPassword, newPassword);
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setupTwoFactor = async () => {
    setLoading(true);
    try {
      const { secret, qrCode } = await twoFactorService.setupTwoFactor(user!.uid);
      setTwoFactorSetup({ secret, qrCode });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyTwoFactor = async () => {
    if (!twoFactorSetup?.secret) return;
    
    setLoading(true);
    try {
      await twoFactorService.verifyAndEnable(user!.uid, twoFactorCode);
      setSuccess('Two-factor authentication enabled');
      setTwoFactorSetup(null);
      setTwoFactorCode('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    setLoading(true);
    try {
      await twoFactorService.disable(user!.uid);
      setSuccess('Two-factor authentication disabled');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Security Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account security</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Password Section */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Key className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-medium">Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          </section>

          {/* Two-Factor Authentication */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Smartphone className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-medium">Two-Factor Authentication</h2>
            </div>

            {user?.settings?.twoFactorEnabled ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Two-factor authentication is enabled for your account.
                </p>
                <button
                  onClick={disableTwoFactor}
                  disabled={loading}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                >
                  Disable Two-Factor Authentication
                </button>
              </div>
            ) : twoFactorSetup ? (
              <div className="max-w-md space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                    <QRCode
                      value={twoFactorSetup.qrCode || ''}
                      size={200}
                      level="H"
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Scan this QR code with your authenticator app or enter the code manually:
                  </p>
                  <code className="block p-2 bg-gray-100 rounded text-sm font-mono break-all">
                    {twoFactorSetup.secret}
                  </code>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter 6-digit code"
                  />
                </div>

                <button
                  onClick={verifyTwoFactor}
                  disabled={loading || !twoFactorCode}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Verify and Enable'
                  )}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <button
                  onClick={setupTwoFactor}
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  Set Up Two-Factor Authentication
                </button>
              </div>
            )}
          </section>

          {/* Active Sessions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <History className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-medium">Active Sessions</h2>
              </div>
              <button
                onClick={() => terminateAllOtherSessions()}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Sign Out All Other Devices
              </button>
            </div>

            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{session.deviceInfo.browser}</div>
                    <div className="text-sm text-gray-500">
                      {session.deviceInfo.os} • {session.deviceInfo.location || 'Unknown location'}
                    </div>
                    <div className="text-xs text-gray-400">
                      Last active: {new Date(session.lastActive).toLocaleString()}
                    </div>
                  </div>
                  {session.current ? (
                    <span className="text-sm text-green-500">Current Session</span>
                  ) : (
                    <button
                      onClick={() => terminateSession(session.id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Security Recommendations */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-medium">Security Recommendations</h2>
            </div>

            <div className="space-y-4">
              {!user?.settings?.twoFactorEnabled && (
                <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Enable Two-Factor Authentication</h3>
                    <p className="text-sm text-yellow-600">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                  </div>
                </div>
              )}

              {sessions.length > 3 && (
                <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Multiple Active Sessions</h3>
                    <p className="text-sm text-yellow-600">
                      You have {sessions.length} active sessions. Consider reviewing and signing out from unused devices.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Account Recovery */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-medium">Account Recovery</h2>
            </div>

            <div className="max-w-md">
              <p className="text-sm text-gray-600 mb-4">
                Set up account recovery options to ensure you can regain access to your account if needed.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recovery Email
                  </label>
                  <input
                    type="email"
                    value={user?.settings?.recovery?.email || ''}
                    onChange={(e) => {
                      if (user) {
                        updateSettings({
                          recovery: {
                            ...user.settings?.recovery,
                            email: e.target.value
                          }
                        });
                      }
                    }}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                    placeholder="backup@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recovery Phone Number
                  </label>
                  <input
                    type="tel"
                    value={user?.settings?.recovery?.phone || ''}
                    onChange={(e) => {
                      if (user) {
                        updateSettings({
                          recovery: {
                            ...user.settings?.recovery,
                            phone: e.target.value
                          }
                        });
                      }
                    }}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                    placeholder="+1234567890"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};