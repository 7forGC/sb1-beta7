import React, { useState } from 'react';
import { 
  Heart, 
  ArrowLeft, 
  Coffee, 
  DollarSign,
  Github,
  Star,
  MessageCircle,
  Bug,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DONATION_TIERS = [
  { amount: 5, description: 'Buy us a coffee' },
  { amount: 10, description: 'Support development' },
  { amount: 20, description: 'Help server costs' },
  { amount: 50, description: 'Become a sponsor' }
];

const SUPPORT_PLATFORMS = [
  {
    name: 'Ko-fi',
    icon: Coffee,
    color: 'bg-[#13C3FF]/10 text-[#13C3FF]',
    url: 'https://ko-fi.com/7forall'
  },
  {
    name: 'GitHub Sponsor',
    icon: Github,
    color: 'bg-gray-100 text-gray-900',
    url: 'https://github.com/sponsors/7-for-all'
  },
  {
    name: 'Buy Me a Coffee',
    icon: Coffee,
    color: 'bg-[#FFDD00]/10 text-[#FFDD00]',
    url: 'https://www.buymeacoffee.com/7forall'
  }
];

export const SupportPage = () => {
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleDonate = (amount: number) => {
    window.open(`https://donate.stripe.com/test_amount=${amount}`, '_blank');
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
              <h1 className="text-2xl font-bold">Support Our Project</h1>
              <p className="text-gray-600 mt-1">Help us keep the project running and growing</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Main Support Card */}
          <div className="bg-gradient-custom text-white p-6 rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
              <Heart className="w-8 h-8 animate-heartbeat" />
              <div>
                <h3 className="font-medium text-lg">Support Our Mission</h3>
                <p className="text-white/80">
                  Help us connect people globally and make communication accessible to everyone
                </p>
              </div>
            </div>

            {/* Donation Tiers */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {DONATION_TIERS.map((tier) => (
                <button
                  key={tier.amount}
                  onClick={() => setSelectedAmount(tier.amount)}
                  className={`p-3 rounded-lg transition-colors ${
                    selectedAmount === tier.amount
                      ? 'bg-white text-primary'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="font-medium">${tier.amount}</div>
                  <div className="text-sm opacity-80">{tier.description}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => selectedAmount && handleDonate(selectedAmount)}
              disabled={!selectedAmount}
              className="w-full py-3 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              Donate ${selectedAmount || '0'}
            </button>
          </div>

          {/* Support Platforms */}
          <section>
            <h2 className="text-lg font-medium mb-4">Other Ways to Support</h2>
            <div className="grid gap-4">
              {SUPPORT_PLATFORMS.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${platform.color}`}>
                      <platform.icon size={20} />
                    </div>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <DollarSign size={20} className="text-gray-400" />
                </a>
              ))}
            </div>
          </section>

          {/* Other Ways to Help */}
          <section>
            <h2 className="text-lg font-medium mb-4">Other Ways to Help</h2>
            <div className="space-y-4">
              <a
                href="https://github.com/7-for-all"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50"
              >
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium">Star on GitHub</div>
                  <p className="text-sm text-gray-600">Show your support by starring our repository</p>
                </div>
              </a>

              <a
                href="https://github.com/7-for-all/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50"
              >
                <div className="p-2 bg-red-100 rounded-lg">
                  <Bug className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium">Report Issues</div>
                  <p className="text-sm text-gray-600">Help us improve by reporting bugs</p>
                </div>
              </a>

              <a
                href="https://github.com/7-for-all/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">Feature Suggestions</div>
                  <p className="text-sm text-gray-600">Share your ideas for new features</p>
                </div>
              </a>

              <a
                href="https://discord.gg/7forall"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Join Our Community</div>
                  <p className="text-sm text-gray-600">Connect with other users and developers</p>
                </div>
              </a>
            </div>
          </section>

          {/* Why Support */}
          <section>
            <h2 className="text-lg font-medium mb-4">Why Support Us?</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Enable free communication worldwide</li>
                <li>• Support multilingual accessibility</li>
                <li>• Help develop new features</li>
                <li>• Keep the service running for everyone</li>
                <li>• Support open-source development</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};