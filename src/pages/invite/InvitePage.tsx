import React, { useState } from 'react';
import { Share2, Copy, Mail, MessageSquare, QrCode } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import QRCode from 'qrcode.react';

export const InvitePage = () => {
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink = `https://7-all.com/invite/${user?.uid}`;
  const inviteMessage = `Join me on 7 for all GC! It's a modern communication app that lets us chat, call, and share moments together. Sign up here: ${inviteLink}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleEmailInvite = () => {
    const mailtoLink = `mailto:?subject=Join me on 7 for all GC&body=${encodeURIComponent(inviteMessage)}`;
    window.open(mailtoLink);
  };

  const handleSMSInvite = () => {
    const smsLink = `sms:?body=${encodeURIComponent(inviteMessage)}`;
    window.open(smsLink);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '7 for all GC',
          text: inviteMessage,
          url: inviteLink
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Invite Friends</h1>
          <p className="text-gray-600 mt-2">Share 7 for all GC with your friends and family</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Invite Link */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Invite Link
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 px-3 py-2 bg-white border rounded-lg focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
              >
                <Copy size={18} />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleEmailInvite}
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Email</div>
                <div className="text-sm text-gray-500">Send invitation via email</div>
              </div>
            </button>

            <button
              onClick={handleSMSInvite}
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">SMS</div>
                <div className="text-sm text-gray-500">Send invitation via SMS</div>
              </div>
            </button>

            <button
              onClick={() => setShowQR(!showQR)}
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <QrCode className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">QR Code</div>
                <div className="text-sm text-gray-500">Share via QR code</div>
              </div>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Share2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">More Options</div>
                <div className="text-sm text-gray-500">Share via other apps</div>
              </div>
            </button>
          </div>

          {/* QR Code Modal */}
          {showQR && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-medium mb-4">Scan QR Code</h3>
                <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                  <QRCode
                    value={inviteLink}
                    size={200}
                    level="H"
                    includeMargin
                    className="mx-auto"
                  />
                </div>
                <button
                  onClick={() => setShowQR(false)}
                  className="mt-4 w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Referral Benefits */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-medium mb-4">Why Invite Friends?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">Better Experience</div>
                <p className="text-sm text-gray-600">
                  More friends means more fun conversations and shared moments
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">Group Features</div>
                <p className="text-sm text-gray-600">
                  Create groups and enjoy video calls with multiple friends
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">Stay Connected</div>
                <p className="text-sm text-gray-600">
                  Keep in touch with your loved ones in one place
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};