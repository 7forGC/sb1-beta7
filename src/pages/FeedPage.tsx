import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Stories } from '../components/Stories';
import { Feed } from '../components/Feed';
import { Reels } from '../components/Reels';
import { Clapperboard, Image, Film } from 'lucide-react';

export const FeedPage = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'stories' | 'reels'>('posts');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-white border-b px-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === 'posts'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Image size={20} />
                  <span className="font-medium">Posts</span>
                </button>
                <button
                  onClick={() => setActiveTab('stories')}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === 'stories'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Film size={20} />
                  <span className="font-medium">Stories</span>
                </button>
                <button
                  onClick={() => setActiveTab('reels')}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === 'reels'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Clapperboard size={20} />
                  <span className="font-medium">Reels</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto py-6 px-4">
              {activeTab === 'posts' && <Feed />}
              {activeTab === 'stories' && <Stories />}
              {activeTab === 'reels' && <Reels />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};