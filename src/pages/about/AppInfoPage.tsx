import React from 'react';
import { 
  Info, 
  ArrowLeft, 
  Heart, 
  Globe, 
  Shield, 
  MessageCircle,
  Video,
  Users,
  Zap,
  Github
} from 'lucide-react';
import { Logo } from '../../components/Logo';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '2024031501';

const FEATURES = [
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'Communicate in your preferred language with automatic translation'
  },
  {
    icon: Shield,
    title: 'Secure Communication',
    description: 'End-to-end encryption for messages and calls'
  },
  {
    icon: MessageCircle,
    title: 'Rich Messaging',
    description: 'Share text, photos, videos, and documents'
  },
  {
    icon: Video,
    title: 'HD Video Calls',
    description: 'Crystal clear video and voice calls'
  },
  {
    icon: Users,
    title: 'Group Features',
    description: 'Create groups and manage lists for better organization'
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'Optimized for speed and reliability'
  }
];

export const AppInfoPage = () => {
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
              <h1 className="text-2xl font-bold">App Info</h1>
              <p className="text-gray-600 mt-1">About 7 for all GC</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* App Logo and Version */}
          <section className="text-center">
            <div className="w-24 h-24 mx-auto mb-4">
              <Logo />
            </div>
            <h2 className="text-2xl font-bold">7 for all GC</h2>
            <p className="text-gray-600">Modern Communication Application</p>
            <div className="mt-2 text-sm text-gray-500">
              Version {APP_VERSION} ({BUILD_NUMBER})
            </div>
            <a
              href="https://7-all.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-primary hover:text-primary-dark"
            >
              7-all.com
            </a>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-lg font-medium mb-4">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((feature, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-medium">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Support and Feedback */}
          <section>
            <h2 className="text-lg font-medium mb-4">Support & Feedback</h2>
            <div className="space-y-4">
              <a
                href="https://7-all.com/support"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium mb-1">Help Center</div>
                <p className="text-sm text-gray-600">
                  Visit our help center for guides and FAQs
                </p>
              </a>

              <a
                href="https://7-all.com/feedback"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium mb-1">Send Feedback</div>
                <p className="text-sm text-gray-600">
                  Help us improve by sharing your feedback
                </p>
              </a>
            </div>
          </section>

          {/* Open Source */}
          <section>
            <h2 className="text-lg font-medium mb-4">Open Source</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium mb-1">GitHub Repository</div>
                  <p className="text-sm text-gray-600">
                    This project is open source
                  </p>
                </div>
                <a
                  href="https://github.com/7-all/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <Github size={24} />
                </a>
              </div>
            </div>
          </section>

          {/* Support the Project */}
          <section>
            <h2 className="text-lg font-medium mb-4">Support the Project</h2>
            <div className="bg-gradient-custom text-white p-6 rounded-lg">
              <div className="flex items-center space-x-4 mb-4">
                <Heart className="w-8 h-8 animate-heartbeat" />
                <div>
                  <h3 className="font-medium text-lg">Support Our Mission</h3>
                  <p className="text-white/80">
                    Help us keep the project running and growing
                  </p>
                </div>
              </div>
              <a
                href="https://7-all.com/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors"
              >
                Support the Project
              </a>
            </div>
          </section>

          {/* Legal */}
          <section>
            <h2 className="text-lg font-medium mb-4">Legal</h2>
            <div className="space-y-2">
              <a
                href="https://7-all.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 hover:text-gray-900"
              >
                Privacy Policy
              </a>
              <a
                href="https://7-all.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 hover:text-gray-900"
              >
                Terms of Service
              </a>
              <a
                href="https://7-all.com/licenses"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 hover:text-gray-900"
              >
                Open Source Licenses
              </a>
            </div>
          </section>

          {/* Copyright */}
          <section className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>© {new Date().getFullYear()} 7 for all GC. All rights reserved.</p>
          </section>
        </div>
      </div>
    </div>
  );
};