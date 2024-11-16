import React, { useState, useRef } from 'react';
import { Plus, X, Upload, Check, Camera } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { StoryViewer } from './StoryViewer';

const DEMO_STORIES = [
  {
    id: '1',
    user: {
      name: 'Ana Marković',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    media: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    timestamp: new Date().getTime() - 1800000,
  },
  {
    id: '2',
    user: {
      name: 'Marko Petrović',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    },
    media: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    timestamp: new Date().getTime() - 3600000,
  },
];

export const Stories = () => {
  const { user } = useAuth();
  const [selectedStory, setSelectedStory] = useState<typeof DEMO_STORIES[0] | null>(null);
  const [showNewStory, setShowNewStory] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('File size must be less than 100MB');
      return;
    }

    // Check if it's a video and ensure proper format
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        // Check aspect ratio
        const aspectRatio = video.videoWidth / video.videoHeight;
        if (Math.abs(aspectRatio - 9/16) > 0.1) { // Allow small deviation
          alert('Please upload a video with 9:16 aspect ratio (portrait mode)');
          return;
        }
        
        setSelectedMedia(file);
        setPreviewUrl(URL.createObjectURL(file));
      };

      video.src = URL.createObjectURL(file);
    } else {
      setSelectedMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    if (selectedMedia) {
      setShowDiscardConfirm(true);
    } else {
      handleDiscard();
    }
  };

  const handleDiscard = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedMedia(null);
    setPreviewUrl(null);
    setShowNewStory(false);
    setShowDiscardConfirm(false);
  };

  const handleUploadStory = async () => {
    if (!selectedMedia) return;

    setLoading(true);
    try {
      // Handle story upload here
      handleDiscard();
    } catch (error) {
      console.error('Error uploading story:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stories Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Add Story Button */}
        <button
          onClick={() => setShowNewStory(true)}
          className="aspect-[9/16] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-100 transition-colors flex flex-col items-center justify-center"
        >
          <div className="p-3 bg-primary/10 rounded-full mb-2">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-medium text-gray-700">Add Story</span>
        </button>

        {/* Stories List */}
        {DEMO_STORIES.map((story) => (
          <button
            key={story.id}
            onClick={() => setSelectedStory(story)}
            className="relative aspect-[9/16] rounded-xl overflow-hidden"
          >
            <img
              src={story.media}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            
            {/* User Info */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={story.user.avatar}
                  alt={story.user.name}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <div className="text-left">
                  <div className="font-medium text-white">{story.user.name}</div>
                  <div className="text-sm text-white/80">
                    {new Date(story.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* New Story Modal */}
      {showNewStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="w-full h-full md:max-w-md md:h-auto">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">New Story</h2>
              <button
                onClick={handleClose}
                className="p-2 text-white hover:bg-white/10 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {previewUrl ? (
                <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden">
                  {selectedMedia?.type.startsWith('video/') ? (
                    <video
                      ref={videoRef}
                      src={previewUrl}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      autoPlay
                      muted
                      loop
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Story preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={() => {
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                      }
                      setSelectedMedia(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[9/16] bg-gray-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <Upload size={32} className="text-white mb-2" />
                  <span className="text-white">Add Media</span>
                  <span className="text-sm text-white/60 mt-1">Photo or Video • Max 100MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    onChange={handleMediaSelect}
                    className="hidden"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadStory}
                  disabled={loading || !selectedMedia}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Check size={20} />
                  <span>{loading ? 'Sharing...' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-4">
            <h3 className="text-lg font-semibold mb-2">Discard Story?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to discard your story? Your media will be lost.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Keep
              </button>
              <button
                onClick={handleDiscard}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {selectedStory && (
        <StoryViewer
          stories={[selectedStory]}
          currentUser={user!}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
};